import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/rooms/validate';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connections: [{ readyState: 1 }],
}));

// Mock Room model
const mockRoom = {
  findOne: jest.fn(),
  save: jest.fn(),
  updateActivity: jest.fn(),
};

jest.mock('../../models/Room', () => {
  return jest.fn().mockImplementation(() => mockRoom);
});

describe('/api/rooms/validate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';
  });

  describe('POST /api/rooms/validate', () => {
    it('validates existing room successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          code: 'ABC123',
          createIfNotExists: false,
        },
      });

      // Mock existing room
      const mockExistingRoom = {
        code: 'ABC123',
        name: null,
        createdAt: new Date(),
        updateActivity: jest.fn(),
      };
      
      const Room = require('../../models/Room');
      Room.prototype.findOne = jest.fn().mockResolvedValue(mockExistingRoom);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        valid: true,
        room: {
          code: 'ABC123',
          name: null,
          createdAt: mockExistingRoom.createdAt,
        },
      });
    });

    it('returns error for non-existent room', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          code: 'NOROOM',
          createIfNotExists: false,
        },
      });

      const Room = require('../../models/Room');
      Room.prototype.findOne = jest.fn().mockResolvedValue(null);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({
        valid: false,
        error: 'Room not found',
      });
    });

    it('creates room when createIfNotExists is true', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          code: 'NEW123',
          createIfNotExists: true,
        },
      });

      const mockNewRoom = {
        code: 'NEW123',
        name: null,
        createdAt: new Date(),
        updateActivity: jest.fn(),
        save: jest.fn(),
      };

      const Room = require('../../models/Room');
      Room.prototype.findOne = jest.fn().mockResolvedValue(null);
      Room.mockImplementation(() => mockNewRoom);

      await handler(req, res);

      expect(mockNewRoom.save).toHaveBeenCalled();
      expect(res._getStatusCode()).toBe(200);
    });

    it('validates room code format', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          code: 'INVALID_FORMAT',
          createIfNotExists: false,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        valid: false,
        error: 'Room code must be 6 alphanumeric characters',
      });
    });

    it('handles missing code', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          createIfNotExists: false,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        valid: false,
        error: 'Room code must be 6 alphanumeric characters',
      });
    });
  });

  describe('GET /api/rooms/validate', () => {
    it('generates new room code', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      const Room = require('../../models/Room');
      Room.prototype.findOne = jest.fn().mockResolvedValue(null);

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.code).toMatch(/^[A-Z0-9]{6}$/);
    });

    it('generates unique code when collision occurs', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      const Room = require('../../models/Room');
      Room.prototype.findOne = jest.fn()
        .mockResolvedValueOnce({ code: 'EXIST1' }) // First attempt exists
        .mockResolvedValueOnce(null); // Second attempt is unique

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.code).toMatch(/^[A-Z0-9]{6}$/);
      expect(Room.prototype.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('Invalid methods', () => {
    it('returns 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getHeaders()['allow']).toEqual(['POST', 'GET']);
    });
  });
});