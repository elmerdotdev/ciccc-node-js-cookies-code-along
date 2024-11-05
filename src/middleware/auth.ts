import { Request, Response, NextFunction } from 'express'

// Check authentication for My Account
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session?.isAuthenticated)
  if (req.session?.isAuthenticated) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Check authToken cookie for Login page
export const checkLoginAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.isAuthenticated) {
    res.redirect('/my-account')
  } else {
    next()
  }
}