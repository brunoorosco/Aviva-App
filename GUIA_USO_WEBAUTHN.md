# 🔐 Como Funciona WebAuthn na Prática - Guia Visual

## 📱 Fluxo do Usuário na Página Web

### 1️⃣ TELA DE LOGIN (Primeira Vez)

```
┌─────────────────────────────────────────┐
│  🔷 Logo Avivamento em Cristo           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  👆 Entrar com Biometria          │  │
│  │  (Fingerprint icon)               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ────── Ou entre com senha ──────      │
│                                         │
│  📧 Email                               │
│  ┌───────────────────────────────────┐  │
│  │ usuario@email.com                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  🔒 Senha                               │
│  ┌───────────────────────────────────┐  │
│  │ ••••••••                          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [        Entrar        ]              │
└─────────────────────────────────────────┘
```

**O que acontece:**
- Usuário vê 2 opções: Biometria OU Senha
- Na primeira vez, deve usar senha (não tem biometria cadastrada ainda)
- Após login com senha, será oferecido cadastrar biometria

---

### 2️⃣ APÓS LOGIN COM SENHA - MODAL APARECE

```
┌─────────────────────────────────────────┐
│  ✨ Ativar Login Rápido com Biometria   │
│                                         │
│  Configure seu dispositivo para fazer  │
│  login de forma rápida e segura usando │
│  sua digital ou Face ID.               │
│                                         │
│  📱 Benefícios:                         │
│  • Login em 2 segundos                 │
│  • Mais seguro que senhas              │
│  • Sem risco de esquecer senha         │
│                                         │
│  [  Agora não  ]  [  Configurar  ]    │
└─────────────────────────────────────────┘
```

**O que acontece ao clicar "Configurar":**

---

### 3️⃣ NAVEGADOR SOLICITA BIOMETRIA

**No iPhone/iPad (Safari):**
```
┌─────────────────────────────────────────┐
│  Avivamento em Cristo deseja usar      │
│  Face ID para entrar                   │
│                                         │
│         📱                              │
│      [Face ID]                          │
│                                         │
│  Olhe para o iPhone para continuar     │
│                                         │
│            [Cancelar]                   │
└─────────────────────────────────────────┘
```

**No Android (Chrome):**
```
┌─────────────────────────────────────────┐
│  Confirmar identidade                   │
│                                         │
│  Use a impressão digital para          │
│  continuar                              │
│                                         │
│         👆                              │
│    [Sensor Icon]                        │
│                                         │
│  Toque no sensor                        │
│                                         │
│  [   PIN   ]  [  Cancelar  ]          │
└─────────────────────────────────────────┘
```

**No Windows (Edge/Chrome):**
```
┌─────────────────────────────────────────┐
│  Segurança do Windows                   │
│                                         │
│  Use o Windows Hello para entrar       │
│                                         │
│         💻                              │
│    [Windows Hello]                      │
│                                         │
│  • Impressão digital                   │
│  • Reconhecimento facial               │
│  • PIN                                 │
│                                         │
│            [Cancelar]                   │
└─────────────────────────────────────────┘
```

---

### 4️⃣ SUCESSO - BIOMETRIA CADASTRADA

```
┌─────────────────────────────────────────┐
│  ✅ Biometria Configurada!              │
│                                         │
│  Seu dispositivo foi cadastrado com     │
│  sucesso. Nos próximos acessos você    │
│  pode usar biometria para entrar.      │
│                                         │
│  Nome do dispositivo:                   │
│  📱 iPhone de João                      │
│                                         │
│            [   OK   ]                   │
└─────────────────────────────────────────┘
```

---

### 5️⃣ PRÓXIMO LOGIN - USA BIOMETRIA

Usuário volta ao site e clica em "Entrar com Biometria":

```
┌─────────────────────────────────────────┐
│  👆 Autenticando com biometria...       │
│                                         │
│  Confirme sua identidade                │
│                                         │
│         🔄                              │
│    [Loading...]                         │
└─────────────────────────────────────────┘
```

Navegador solicita biometria novamente → Usuário confirma → **Login instantâneo!** ⚡

---

## 🎯 GERENCIAMENTO DE DISPOSITIVOS

### Em Configurações > Segurança e Biometria

```
┌─────────────────────────────────────────────────────┐
│  🛡️ Segurança e Biometria                          │
│                                                     │
│  ──────────────────────────────────────────────    │
│                                                     │
│  📱 Dispositivos com Acesso Biométrico             │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📱 iPhone 14 Pro                           │   │
│  │  Adicionado em: 15/02/2026 10:30           │   │
│  │  Último uso: Hoje às 13:45                 │   │
│  │                          [  🗑️ Remover  ]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  💻 MacBook Air M2                          │   │
│  │  Adicionado em: 10/02/2026 08:15           │   │
│  │  Último uso: 14/02/2026 às 16:20           │   │
│  │                          [  🗑️ Remover  ]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [  ➕ Adicionar Novo Dispositivo  ]               │
│                                                     │
│  ──────────────────────────────────────────────    │
│                                                     │
│  🔑 Alterar Senha                                  │
│  (Senha tradicional continua funcionando)          │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Comportamentos Importantes

### ✅ Cenário 1: Usuário tem biometria cadastrada
- Vê botão "Entrar com Biometria" destacado na tela de login
- Clica → Navegador pede biometria → Login automático
- **Tempo total: ~2 segundos** ⚡

### ✅ Cenário 2: Usuário não tem biometria cadastrada
- Botão "Entrar com Biometria" aparece, mas desabilitado ou com mensagem
- Deve fazer login com senha primeiro
- Após login, oferece cadastrar biometria

### ✅ Cenário 3: Biometria falha ou é cancelada
- Sistema automaticamente mostra opção de usar senha
- Mensagem: "Use sua senha para entrar"

### ✅ Cenário 4: Navegador não suporta biometria
- Botão de biometria fica oculto
- Apenas login com senha disponível

### ✅ Cenário 5: Dispositivo perdido/roubado
- Usuário acessa de outro dispositivo com senha
- Vai em Configurações > Remove o dispositivo perdido
- Biometria daquele dispositivo para de funcionar imediatamente

---

## 🎨 Detalhes Visuais

### Ícones Usados
- 👆 **Fingerprint** - Biometria digital
- 📱 **Face** - Face ID
- 🔒 **Lock** - Segurança
- ✅ **Check** - Sucesso
- ⚠️ **Warning** - Atenção/Erro
- 🗑️ **Trash** - Remover dispositivo

### Cores
- **Verde** - Sucesso (biometria configurada)
- **Azul** - Botão primário (Entrar com Biometria)
- **Cinza** - Botão secundário (Cancelar)
- **Vermelho** - Ações destrutivas (Remover)

---

## 📊 Exemplo de Código Real (Para Desenvolvedores)

### Como o botão detecta se pode usar biometria:

```typescript
// O hook useWebAuthn verifica automaticamente
const { isSupported, hasCredentials } = useWebAuthn();

// No componente:
{isSupported && hasCredentials && (
  <Button onClick={handleBiometricLogin}>
    👆 Entrar com Biometria
  </Button>
)}
```

### Fluxo completo de autenticação:

```typescript
1. Usuário clica "Entrar com Biometria"
   ↓
2. Frontend chama: GET /api/webauthn/authentication-options
   ↓
3. Servidor retorna: { challenge: "abc123...", allowCredentials: [...] }
   ↓
4. Frontend chama: navigator.credentials.get(...)
   ↓
5. NAVEGADOR MOSTRA POPUP DE BIOMETRIA
   ↓
6. Usuário confirma biometria
   ↓
7. Navegador retorna: credencial assinada
   ↓
8. Frontend envia: POST /api/webauthn/authentication-verify
   ↓
9. Servidor valida assinatura
   ↓
10. NextAuth cria sessão
    ↓
11. ✅ USUÁRIO LOGADO!
```

---

## ❓ FAQs Visuais

**P: O que o usuário vê se nunca configurou biometria?**
R: Vê o botão mas ao clicar recebe mensagem "Configure primeiro nas Configurações"

**P: Funciona offline?**
R: Não! Precisa internet para validar no servidor

**P: Posso usar em múltiplos dispositivos?**
R: Sim! Cadastre cada dispositivo separadamente

**P: E se eu trocar de celular?**
R: Cadastre o novo celular e remova o antigo nas Configurações

---

## 🎬 Resumo do Fluxo Visual

```
LOGIN TRADICIONAL          LOGIN COM BIOMETRIA
     ↓                            ↓
┌─────────┐                 ┌──────────┐
│ Digite  │                 │  Clique  │
│ Email + │                 │  no      │
│ Senha   │                 │  Botão   │
└────┬────┘                 └────┬─────┘
     ↓                            ↓
┌─────────┐                 ┌──────────┐
│ Clique  │                 │ Coloque  │
│ Entrar  │                 │ o dedo   │
└────┬────┘                 └────┬─────┘
     ↓                            ↓
┌─────────┐                 ┌──────────┐
│ Aguarde │                 │  Pronto! │
│ 3-5 seg │                 │  2 seg   │
└────┬────┘                 └────┬─────┘
     ↓                            ↓
   Logado                       Logado
```

