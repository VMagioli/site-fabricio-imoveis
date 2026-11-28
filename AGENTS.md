# Checklist Obrigatório de Segurança (Auditoria Contínua)

Sempre que criar, editar ou revisar funcionalidades neste projeto, verifique e garanta obrigatoriamente os 14 pontos de segurança abaixo. Nunca confie em validações apenas no front-end.

## 1. Controle de Acesso e Autenticação
- **Rotas Administrativas (`/admin` / `/gestao`):** Nunca proteger rotas apenas escondendo botões ou validando no front-end. Exigir autenticação e verificação de permissão (`role`/`claims`/RLS) no back-end/banco/middleware para todas as rotas e APIs administrativas.
- **Proteção contra IDOR (ID na URL):** Em qualquer endpoint que receba um ID (URL, query ou body), validar no servidor se o usuário autenticado realmente é o dono daquele recurso ou tem permissão explícita para acessá-lo/editá-lo.
- **Prevenção de Escalação de Privilégio (Mass Assignment):** Em rotas de login, cadastro ou atualização de perfil, nunca aceitar diretamente campos sensíveis vindos do cliente (como `role`, `isAdmin`, `permissions`, `plan`). Filtrar explicitamente apenas os campos permitidos (allowlist).
- **Proteção de Códigos de Autenticação / 2FA (OTP):** Implementar *rate limiting* (limite de tentativas por IP/conta), tempo curto de expiração do código, invalidação imediata após uso e bloqueio temporário contra ataques de força bruta.

## 2. Regras de Negócio, Pagamentos e Cupons
- **Integridade de Preços:** Nunca confiar em preços, descontos ou totais enviados pelo front-end. Sempre buscar o valor real dos produtos no banco de dados e recalcular o total exclusivamente no back-end.
- **Validação de Pedidos:** Antes de criar um pedido, validar no servidor a existência dos itens, disponibilidade/estoque, autenticidade do usuário e integridade de todas as regras de negócio.
- **Validação de Pagamentos:** Nunca aprovar ou liberar entregas/acessos com base em status enviado pelo front-end (ex: `status: "paid"`). Confirmar pagamentos exclusivamente via webhooks assinados pelo gateway de pagamento (validando a assinatura criptográfica) ou consulta direta server-to-server à API do gateway.
- **Uso Único / Limite de Cupons (Race Condition):** Garantir validação de limite de uso de cupons no back-end utilizando transações atômicas ou locks no banco de dados para impedir que múltiplas requisições simultâneas apliquem o mesmo cupom repetidas vezes.

## 3. Entrada de Dados, Uploads e IA
- **Prevenção de XSS (Scripts em campos de texto):** Sanitizar e escapar todas as entradas de usuário (como nome de usuário, comentários, bio) antes de salvar e renderizar. Evitar `innerHTML` / `dangerouslySetInnerHTML` com dados não sanitizados e configurar cabeçalhos CSP (*Content Security Policy*).
- **Validação Rigorosa de Uploads:** Ao aceitar uploads (ex: fotos e vídeos), nunca confiar apenas na extensão do arquivo (evitar ataques como `foto.svg.php`). Validar o tipo real do arquivo (*magic bytes*/MIME type no servidor), usar lista de extensões permitidas, limitar o tamanho, renomear o arquivo e armazená-lo em serviço isolado (ex: Supabase Storage/S3/R2) sem permissão de execução de scripts.
- **Prevenção de SQL / NoSQL Injection:** Nunca concatenar dados do usuário diretamente em consultas ao banco. Usar sempre *prepared statements* (queries parametrizadas) ou ORM seguro. Caso utilize BaaS (como Supabase ou Firebase), garantir políticas rígidas de RLS (*Row Level Security*) no banco de dados.
- **Proteção contra Prompt Injection (Recursos com IA):** Nunca permitir que entradas do usuário sobrescrevam instruções de sistema ou executem ações críticas/consultas privilegiadas diretamente. Isolar o prompt de sistema, validar entradas/saídas e aplicar verificações determinísticas no back-end antes de qualquer ação sensível disparada pela IA.

## 4. Segredos e Infraestrutura
- **Chaves de API fora do Front-end:** Nenhuma chave secreta, token privado ou credencial de serviço pode ficar exposta no código do cliente (browser, bundle JS ou variáveis públicas como `NEXT_PUBLIC_` / `VITE_`). Toda chamada que exija segredo deve passar por uma rota de back-end/API.
- **Proteção do `.env` no Git:** Garantir que `.env`, `.env.local` e quaisquer arquivos com credenciais estejam no `.gitignore` desde o início do projeto, nunca sejam commitados no repositório e sejam gerenciados via variáveis de ambiente seguras em produção.

---
**Instrução de Auditoria:** Ao finalizar qualquer tarefa que envolva rotas, banco de dados, pagamentos, uploads, autenticação ou IA, informe explicitamente quais itens deste checklist foram verificados e aplicados.
