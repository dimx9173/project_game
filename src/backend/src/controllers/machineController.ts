import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Machine, ApiResponse, PaginatedResponse } from '../models/index.js';

// In-memory store
const machines = new Map<string, Machine>();

export const getMachines = (req: AuthRequest, res: Response<ApiResponse<PaginatedResponse<Machine>>>): void => {
  const { page = 1, pageSize = 20, status } = req.query;
  
  let items = Array.from(machines.values());
  
  if (status) {
    items = items.filter(m => m.status === status);
  }

  const total = items.length;
  const pageNum = Number(page);
  const size = Number(pageSize);
  
  res.json({
    success: true,
    data: {
      items: items.slice((pageNum - 1) * size, pageNum * size),
      total,
      page: pageNum,
      pageSize: size,
      totalPages: Math.ceil(total / size)
    }
  });
};

export const getMachineById = (req: AuthRequest, res: Response<ApiResponse<Machine>>): void => {
  const { id } = req.params;
  const machine = machines.get(id);
  
  if (!machine) {
    res.status(404).json({ success: false, error: 'Machine not found' });
    return;
  }
  
  res.json({ success: true, data: machine });
};

export const createMachine = (req: AuthRequest, res: Response<ApiResponse<Machine>>): void => {
  const { machineCode, name, model, providerId, location } = req.body;
  
  const machine: Machine = {
    id: `machine_${Date.now()}`,
    machineCode,
    name,
    model,
    providerId,
    location,
    status: 'offline',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  machines.set(machine.id, machine);
  res.status(201).json({ success: true, data: machine });
};

export const updateMachine = (req: AuthRequest, res: Response<ApiResponse<Machine>>): void => {
  const { id } = req.params;
  const machine = machines.get(id);
  
  if (!machine) {
    res.status(404).json({ success: false, error: 'Machine not found' });
    return;
  }
  
  const updated = { ...machine, ...req.body, updatedAt: new Date() };
  machines.set(id, updated);
  res.json({ success: true, data: updated });
};

export const deleteMachine = (req: AuthRequest, res: Response<ApiResponse>): void => {
  const { id } = req.params;
  
  if (!machines.has(id)) {
    res.status(404).json({ success: false, error: 'Machine not found' });
    return;
  }
  
  machines.delete(id);
  res.json({ success: true, message: 'Machine deleted' });
};
