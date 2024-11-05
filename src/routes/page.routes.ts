import { Router, Request, Response} from 'express'
import { checkAuth, checkLoginAuth } from '../middleware/auth'
import bcrypt from 'bcrypt'

const pageRouter = Router()

const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

// In-memory database
let users: User[] = []

// Home route
pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).render('index')
})

// Login route
pageRouter.get('/login', checkLoginAuth, (req: Request, res: Response) => {
  res.status(200).render('login')
})

// Process login route
pageRouter.post('/login', async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
  const { username, password } = req.body
  const found = users.find(user => user.username === username)
  if (found && await bcrypt.compare(password, found.password)) {
    // res.cookie('authToken', 'authenticated', {
    //   maxAge: 3 * 60 * 1000, // 3 minutes
    //   httpOnly: true,
    //   signed: true
    // })
    req.session!.isAuthenticated = true
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

// Register route
pageRouter.get('/register', (req: Request, res: Response) => {
  res.status(200).render('register')
})

// Register process route
pageRouter.post('/register', async (req: Request<{}, {}, User>, res: Response) => {
  try {
    const { username, email, password } = req.body
    const saltRounds: number = 12

    const hashed: string = await hashPassword(password, saltRounds)
    users.push({ username, password: hashed, email})
    console.log(users)
    res.status(201).send(`User added with password: ${hashed}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

// My Account route
pageRouter.get('/my-account', checkAuth, (req: Request, res: Response) => {
  const { username, email } = JSON.parse(req.cookies.user_info) // Convert string to object
  res.status(200).render('my_account', { username, email })
})

// Logout Route
pageRouter.get('/logout', (req: Request, res: Response) => {
  req.session = null
  res.clearCookie('user_info')
  res.redirect('/')
})

export default pageRouter