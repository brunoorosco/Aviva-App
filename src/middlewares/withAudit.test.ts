import { createMocks } from 'node-mocks-http';
import { withAudit } from './withAudit';
import { AuditoriaRepository } from '@/infra/db/repositories/mongo/auditoria';
import { getServerSession } from 'next-auth/next';

// Mock das dependências
jest.mock('@/infra/db/repositories/mongo/auditoria');
jest.mock('next-auth/next');
jest.mock('@/pages/api/auth/[...nextauth]', () => ({
  authOptions: {}
}));

describe('withAudit Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar auditoria para requisições POST com sucesso', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/protected/test',
      body: { data: 'teste unitário' },
    });

    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user_123', name: 'Test User', email: 'test@example.com' },
    });

    const handler = jest.fn((req, res) => res.status(200).json({ success: true }));
    const auditedHandler = withAudit(handler);

    await auditedHandler(req as any, res as any);

    expect(handler).toHaveBeenCalled();
    expect(AuditoriaRepository.prototype.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user_123',
        action: 'POST',
        method: 'POST',
        statusCode: 200,
        requestBody: { data: 'teste unitário' },
        responseBody: { success: true },
      })
    );
  });

  it('deve capturar e registrar erros quando o handler falha', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      url: '/api/protected/test',
      body: { update: 'data' },
    });

    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user_123', name: 'Test User', email: 'test@example.com' },
    });

    const error = new Error('Erro de teste');
    const handler = jest.fn(() => { throw error; });
    const auditedHandler = withAudit(handler);

    await auditedHandler(req as any, res as any);

    expect(AuditoriaRepository.prototype.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'PUT',
        statusCode: 500,
        error: expect.stringContaining('Erro de teste'),
      })
    );
    expect(res.statusCode).toBe(500);
  });

  it('não deve auditar métodos GET', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/protected/test',
    });

    const handler = jest.fn((req, res) => res.status(200).json({ data: [] }));
    const auditedHandler = withAudit(handler);

    await auditedHandler(req as any, res as any);

    expect(handler).toHaveBeenCalled();
    expect(AuditoriaRepository.prototype.create).not.toHaveBeenCalled();
  });
});
