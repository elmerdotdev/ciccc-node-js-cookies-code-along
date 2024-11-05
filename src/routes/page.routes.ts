import { Router, Request, Response} from 'express'
import { checkAuth, checkLoginAuth } from '../middleware/auth'

const pageRouter = Router()

// In-memory database
let users: User[] = [
  { username: 'admin', email: 'admin@admin.com', password: 'admin123' },
  { username: 'guest', email: 'guest@guest.com', password: 'guest123' }
]

// Home route
pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).render('index')
})

// Login route
pageRouter.get('/login', checkLoginAuth, (req: Request, res: Response) => {
  res.status(200).render('login')
})

// Process login route
pageRouter.post('/login', (req: Request<{}, {}, UserRequestBody>, res: Response) => {
  const { username, password } = req.body 
  const found = users.find(user => user.username === username && user.password === password)
  if (found) {
    res.cookie('authToken', 'authenticated', {
      maxAge: 3 * 60 * 1000, // 3 minutes
      httpOnly: true,
      signed: true
    })
    res.cookie('user_info', JSON.stringify({ // Convert object to string
      username: found.username,
      email: found.email
    }), {
      maxAge: 3 * 60 * 1000,
      httpOnly: true
    })
    res.redirect('/my-account')
  } else {
    res.redirect('/login')
  }
})

// My Account route
pageRouter.get('/my-account', checkAuth, (req: Request, res: Response) => {
  const { username, email } = JSON.parse(req.cookies.user_info) // Convert string to object
  res.status(200).render('my_account', { username, email })
})

// Logout Route
pageRouter.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken')
  res.clearCookie('user_info')
  res.redirect('/')
})

export default pageRouter