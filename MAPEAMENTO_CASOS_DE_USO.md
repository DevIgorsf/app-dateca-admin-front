# Mapeamento de Casos de Uso — Plataforma DATECA (por perfil de usuário)

Levantamento feito a partir do código-fonte dos três repositórios do projeto (`app-dateca-backend`, `app-dateca-admin-front` e `app-dateca-client-front`), não apenas das telas. Reflete o comportamento real implementado.

## Perfis (roles) da plataforma

A plataforma define 3 perfis via `RoleEnum` no backend, carregados como claim `role` no JWT de autenticação:

- **STUDENT** (Aluno)
- **PROFESSOR**
- **ADMIN**

## Onde cada perfil consegue entrar

| Frontend | Aluno | Professor | Admin |
|---|:---:|:---:|:---:|
| **client-front** (app do aluno) | ✅ | ✅ | ✅ |
| **admin-front** (painel de gestão) | ❌ (login bloqueado explicitamente) | ✅ | ✅ |

O `admin-front` rejeita login de ALUNO no próprio serviço de autenticação (`src/app/service/auth/user.service.ts`, método `verificarRole`), lançando erro antes mesmo de entrar no painel. Já o `client-front` aceita as três roles — ou seja, Professor e Admin também podem usar o app "do aluno".

---

## 1. Casos de uso comuns a qualquer usuário autenticado (client-front)

Independem da role — todo usuário logado no client-front tem acesso:

| Caso de uso | Tela | Endpoint |
|---|---|---|
| Fazer login / logout | Signin | `POST /login` |
| Ver e editar perfil, trocar senha | Perfil | `GET/PUT /aluno/perfil` |
| Responder questões avulsas (Quiz) | Quizz | `GET /questao/aluno`, `POST /questao/answerQuestion/:id` |
| Responder questões estilo Enade | Enade | `GET /enade/aluno`, `POST /enade/answerEnade/:id` |
| Ver pontuação e ranking geral de gamificação | Pontuação | `GET /aluno/ranking-geral` |
| Criar/editar/publicar suas próprias provas (estilo Kahoot: capa, questões, agendamento, visibilidade pública/amigos) | Criar Prova, Minhas Provas | `POST/PUT/DELETE /provas` |
| Responder provas de outros usuários (conforme visibilidade) e ver ranking da prova | Visualizar Prova | `GET /provas/:id/questoes/aluno`, `POST /provas/:id/responder` |
| Gerenciar amizades: buscar usuários, enviar/aceitar/recusar/cancelar/bloquear solicitação | Adicionar Amigo | `/friendships`, `/users/search`, `/me/friends*` |

## 2. Diferenciação real dentro do client-front: Aluno × (Professor/Admin)

Só um item muda: **"Importar Prova"** (upload de PDF + extração automática de questões por IA, com tela de revisão do rascunho antes de publicar) fica **oculto no menu para Aluno** e visível só para Professor/Admin (`src/app/shared/sidebar/sidebar.component.html`, condição `usuario.role !== 'STUDENT'`).

> **Achado:** essa restrição é só cosmética no menu — não existe *route guard* de role na rota `/client/importacao`. Um aluno digitando a URL diretamente carrega a tela; o bloqueio de verdade acontece no backend, que rejeita com 403 (`/importacao/**` exige `ADMIN` ou `PROFESSOR`, ver `SecurityConfigurations.java`).

## 3. Gestão de conteúdo oficial — admin-front (Professor e Admin)

Essas telas só existem no `admin-front`, logo por definição excluem o Aluno:

| Caso de uso | Módulo | Quem pode (backend) |
|---|---|---|
| Dashboard com indicadores (contagem de professores, matérias, questões, provas Enade, alunos; % de acerto) | Dashboard | Qualquer não-aluno logado |
| Cadastrar / editar Matéria (Curso) | Matérias | Qualquer não-aluno logado |
| Cadastrar / editar Questão (banco do Quiz) e ver resultados agregados | Questões | Qualquer não-aluno logado |
| Cadastrar / editar Prova Enade (com upload de imagens) e ver resultados agregados | Enade | Qualquer não-aluno logado |
| Cadastrar / editar Professor | Professores | Qualquer não-aluno logado |
| Ver ranking geral de alunos (visão administrativa) | Ranking | Qualquer não-aluno logado |
| Importar prova via IA (upload → extração → revisão do rascunho → publicar) | Importar Prova | **ADMIN ou PROFESSOR** (única checagem explícita nesse grupo) |

## 4. Casos de uso exclusivos do Admin

O backend só reserva duas ações explicitamente ao Admin (`SecurityConfigurations.java`):

- **Excluir Professor** — `DELETE /professor/:id` exige `hasAuthority("ADMIN")`
- **Excluir Matéria** — `DELETE /materia/:id` exige `hasAuthority("ADMIN")`

Excluir Questão e Excluir Enade, por outro lado, aceitam ADMIN **ou** PROFESSOR — não são exclusivos do Admin.

## 5. Criação de conta por perfil

| Perfil | Como a conta é criada |
|---|---|
| Aluno | Autocadastro público (`POST /aluno/cadastrar`), tela "Signup" |
| Professor | Só por quem já está logado no admin-front (tela "Adicionar professor") — sem autocadastro |
| Admin | Não existe caso de uso de criação via aplicação. O `ProfessorCreate` sempre grava `RoleEnum.PROFESSOR`; contas Admin só são provisionadas manualmente no banco (há um seeder comentado no código, `DatabaseInitializer.java`, que cria um usuário `ADMIN` fixo) |

---

## Observação geral sobre o modelo de permissões

A separação de permissões é mais rasa do que a divisão em três telas/menus sugere:

- **Nenhuma tela do admin-front esconde ações por role.** Uma busca no código dos componentes de Professores/Matérias/Questões/Enade não encontrou nenhuma lógica condicional de `role`. Um Professor vê exatamente os mesmos botões "Excluir" que um Admin; o clique só falha (403) quando a ação é de fato restrita no backend.
- Fora das duas exclusividades do Admin (excluir Professor/Matéria) e da exclusividade Professor+Admin sobre Importação/exclusão de Questão-Enade, **criar e editar** Professor, Matéria, Questão e Enade não têm restrição de role nenhuma no gateway de segurança (`SecurityConfigurations.java`) — o controle de acesso real é "conseguir logar no admin-front", que por sua vez só barra o Aluno.

Em resumo, a plataforma tem **duas linhas de corte**, não três níveis hierárquicos completos:

1. Aluno vs. não-aluno — delimita quem entra no admin-front e quem vê "Importar Prova" no client-front.
2. Dentro de "não-aluno", Admin tem duas ações exclusivas (excluir Professor e excluir Matéria) sobre o que Professor também pode fazer.
