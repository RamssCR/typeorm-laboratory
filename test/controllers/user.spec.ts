import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '#controllers/user';
import type { Pagination } from '#types/pagination';
import type { User } from '#models/user';
import { UserService } from '#services/user';

vi.mock('#services/user');

describe('User Controller', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('getUserById - should retrieve a user by ID', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/users/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockUser = {
      id: 1,
      username: 'John Doe',
      email: 'john.doe@example.com',
    } as User;
    vi.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

    const handler = getUserById(userService);
    await handler(req, res, next);

    expect(userService.findOne).toHaveBeenCalledWith(1);
    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data).toEqual({
      status: 'success',
      message: 'User retrieved successfully',
      data: mockUser,
    });
  });

  test('getUsers - should retrieve a list of users', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/users',
      query: { page: '1', limit: '10', offset: '0' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockUsers = {
      items: [
        { id: 1, username: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, username: 'Jane Smith', email: 'jane.smith@example.com' },
      ],
      page: 1,
      total: 2,
      pages: 1,
    };
    vi.spyOn(userService, 'findAll').mockResolvedValue(
      mockUsers as Pagination<User>,
    );
    const handler = getUsers(userService);
    await handler(req, res, next);

    expect(userService.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      offset: 0,
    });
    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();

    expect(data).toEqual({
      status: 'success',
      message: 'Users retrieved successfully',
      data: mockUsers,
    });
  });

  test('createUser - should create a new user', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/users',
      body: { username: 'New User', email: 'new.user@example.com' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockCreatedUser = {
      id: 3,
      username: 'New User',
      email: 'new.user@example.com',
    } as User;
    vi.spyOn(userService, 'create').mockResolvedValue(mockCreatedUser);

    const handler = createUser(userService);
    await handler(req, res, next);

    expect(userService.create).toHaveBeenCalledWith({
      username: 'New User',
      email: 'new.user@example.com',
    });
    expect(res._getStatusCode()).toBe(201);
  });

  test('updateUser - should update an existing user', async () => {
    const req = createRequest({
      method: 'PUT',
      url: '/users/1',
      params: { id: '1' },
      body: { username: 'Updated User' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockUpdatedUser = {
      id: 1,
      username: 'Updated User',
      email: 'updated.user@example.com',
    } as User;

    vi.spyOn(userService, 'update').mockResolvedValue(mockUpdatedUser);

    const handler = updateUser(userService);
    await handler(req, res, next);

    expect(userService.update).toHaveBeenCalledWith(1, {
      username: 'Updated User',
    });
    expect(res._getStatusCode()).toBe(200);
  });

  test('deleteUser - should delete a user by ID', async () => {
    const req = createRequest({
      method: 'DELETE',
      url: '/users/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(userService, 'delete').mockResolvedValue(true);
    const handler = deleteUser(userService);
    await handler(req, res, next);

    expect(userService.delete).toHaveBeenCalledWith(1);
    expect(res._getStatusCode()).toBe(200);
  });
});

describe('User Controller Error Handling', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('getUserById - should call next with error when service throws', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/users/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(userService, 'findOne').mockRejectedValue(
      new Error('User not found'),
    );

    const handler = getUserById(userService);
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('createUser - should call next with error when service throws', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/users',
      body: { username: 'New User', email: 'new.user@example.com' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(userService, 'create').mockRejectedValue(
      new Error('Creation failed'),
    );

    const handler = createUser(userService);
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('updateUser - should call next with error when service throws', async () => {
    const req = createRequest({
      method: 'PUT',
      url: '/users/1',
      params: { id: '1' },
      body: { username: 'Updated User' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(userService, 'update').mockRejectedValue(
      new Error('Update failed'),
    );
    const handler = updateUser(userService);
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('deleteUser - should call next with error when service throws', async () => {
    const req = createRequest({
      method: 'DELETE',
      url: '/users/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(userService, 'delete').mockRejectedValue(
      new Error('Deletion failed'),
    );
    const handler = deleteUser(userService);
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('getUsers - should call next with error when service throws', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/users',
      query: { page: '1', limit: '10', offset: '0' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(userService, 'findAll').mockRejectedValue(
      new Error('Retrieval failed'),
    );
    const handler = getUsers(userService);
    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
