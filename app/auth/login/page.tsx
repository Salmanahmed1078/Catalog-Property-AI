"use client"

import { Client, Account } from "appwrite"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Building2 } from 'lucide-react' // Comment out Lucide icon

// Initialize Appwrite client
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("67a9aae900075032d003")

const account = new Account(client)

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailLogin = async () => {
    try {
      await account.createSession(email, password)
      window.location.reload() // Refresh to reflect login
    } catch (err) {
      console.error(err) // Log the error
      setError("Invalid credentials. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session("google", "http://localhost:3000")
    } catch (err) {
      console.error("Google login failed:", err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Option 1: Using local image with Next.js Image component (Recommended) */}
          <div className="h-16 w-16 relative">
            <Image
              src="/images/building-2.png" // Put your logo in the public/images folder
              alt="Company Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Option 2: Using remote image with Next.js Image */}
          {/* <div className="h-16 w-16 relative">
            <Image
              src="https://your-domain.com/logo.png" // Your remote image URL
              alt="Company Logo"
              fill
              className="object-contain"
              priority
              unoptimized={false} // Set to true if you want to skip optimization
            />
          </div> */}

          {/* Option 3: Using regular img tag (not recommended but simpler) */}
          {/* <img
            src="/images/logo.png"
            alt="Company Logo"
            className="h-16 w-auto"
          /> */}

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            DAMAC
          </h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-medium">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                className="bg-white/50 backdrop-blur-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="bg-white/50 backdrop-blur-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-2">
              <Button
                onClick={handleEmailLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
              >
                Sign in with Email
              </Button>

              <Button onClick={handleGoogleLogin} variant="outline" className="w-full border-2 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Not registered?{" "}
          <a href="#" className="text-primary hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}

