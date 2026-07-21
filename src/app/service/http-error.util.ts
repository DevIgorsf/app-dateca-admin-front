import { HttpErrorResponse } from '@angular/common/http';

export const SERVICO_INDISPONIVEL_MENSAGEM =
  'Não foi possível conectar ao servidor. O serviço está temporariamente fora do ar. Tente novamente mais tarde.';

export function isServicoIndisponivel(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 0;
}
