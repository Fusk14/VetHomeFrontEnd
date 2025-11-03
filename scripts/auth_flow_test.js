// Simple auth flow tests that simulate the app's localStorage behavior
// Run with: node .\scripts\auth_flow_test.js

const correoRegex = /^[A-Za-z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => (store[key] === undefined ? null : store[key]),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
    _dump: () => ({ ...store })
  }
})()

function loadUsuarios() {
  try {
    const raw = localStorageMock.getItem('usuarios') || '[]'
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}
function saveUsuarios(list) {
  localStorageMock.setItem('usuarios', JSON.stringify(list))
}

function registerUser(nombre, correo, contrasena) {
  // validations same as Registro.tsx
  if (!correo || correo.length > 100 || !correoRegex.test(correo)) {
    return { success: false, msg: 'correo inválido' }
  }
  if (!contrasena || contrasena.length < 4 || contrasena.length > 10) {
    return { success: false, msg: 'contraseña inválida' }
  }
  const usuarios = loadUsuarios()
  if (usuarios.find(u => u.correo === correo)) return { success: false, msg: 'duplicado' }
  usuarios.push({ nombre, correo, contrasena, rol: 'cliente' })
  saveUsuarios(usuarios)
  return { success: true, msg: 'registrado' }
}

function loginUser(correo, contrasena) {
  const usuarios = loadUsuarios()
  const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena)
  if (!usuario) return { success: false, msg: 'credenciales inválidas' }
  // simulate AuthContext.login behaviour
  localStorageMock.setItem('auth_user', JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol || 'cliente' }))
  localStorageMock.setItem('isLoggedIn', 'true')
  localStorageMock.setItem('nombre', usuario.nombre)
  localStorageMock.setItem('correo', usuario.correo)
  localStorageMock.setItem('rol', usuario.rol)
  return { success: true, msg: 'login exitoso' }
}

// Test cases
const tests = []

// 1 - invalid correo domain
tests.push(() => {
  localStorageMock.clear()
  const r = registerUser('Ana', 'ana@example.com', 'pass1')
  return r.success === false && r.msg === 'correo inválido'
})

// 2 - correo too long
tests.push(() => {
  localStorageMock.clear()
  const long = 'a'.repeat(101) + '@duoc.cl'
  const r = registerUser('Bob', long, 'pass1')
  return r.success === false
})

// 3 - password too short
tests.push(() => {
  localStorageMock.clear()
  const r = registerUser('Caro', 'caro@duoc.cl', '123')
  return r.success === false
})

// 4 - successful registration
tests.push(() => {
  localStorageMock.clear()
  const r = registerUser('Diego', 'diego@duoc.cl', 'abcd')
  return r.success === true
})

// 5 - duplicate registration
tests.push(() => {
  localStorageMock.clear()
  registerUser('Eve', 'eve@duoc.cl', 'abcd')
  const r2 = registerUser('Eve2', 'eve@duoc.cl', 'abcd')
  return r2.success === false && r2.msg === 'duplicado'
})

// 6 - successful login
tests.push(() => {
  localStorageMock.clear()
  registerUser('Frank', 'frank@profesor.duoc.cl', 'abcde')
  const l = loginUser('frank@profesor.duoc.cl', 'abcde')
  return l.success === true && localStorageMock.getItem('isLoggedIn') === 'true'
})

// 7 - failed login wrong pass
tests.push(() => {
  localStorageMock.clear()
  registerUser('Gina', 'gina@gmail.com', 'mypwd')
  const l = loginUser('gina@gmail.com', 'wrong')
  return l.success === false
})

// Run tests
let passed = 0
const results = []
for (let i = 0; i < tests.length; i++) {
  try {
    const ok = tests[i]()
    results.push({ idx: i + 1, ok })
    if (ok) passed++
  } catch (e) {
    results.push({ idx: i + 1, ok: false, error: String(e) })
  }
}

console.log('Auth flow test results:')
results.forEach(r => console.log('Test', r.idx, ':', r.ok ? 'PASS' : 'FAIL', r.error ? (' - ' + r.error) : ''))
console.log(`Passed ${passed} / ${tests.length}`)

if (passed === tests.length) {
  console.log('All tests passed ✅')
  process.exit(0)
} else {
  console.error('Some tests failed ❌')
  process.exit(1)
}
