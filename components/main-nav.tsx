"use client"

import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"

export function MainNav() {
  return (
    <div className="w-full text-center">
      <motion.div
        className="mb-6 space-y-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">Department of Information Technology</h1>
        <h2 className="text-lg md:text-xl">National Institute of Technology Karnataka, Surathkal - 575025</h2>
        <h3 className="text-md md:text-lg italic">Information Assurance and Security (IT352) Course Project</h3>
        <h2 className="text-xl font-bold mt-4 md:text-2xl">SQL Injection Detection Network</h2>
        <div className="mt-3 text-sm md:text-base">
          <p>Carried out by</p>
          <p>Ayush Kumar (221IT015)</p>
          <p>K Jaggarao (221IT037)</p>
          <p className="text-sm text-muted-foreground mt-1">During Academic Session January - April 2025</p>
        </div>
      </motion.div>
      <div className="flex items-center justify-center space-x-4 lg:space-x-6 mt-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <ShieldAlert className="h-6 w-6" />
          </motion.div>
          <span className="font-bold">SQL Injection Validator</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Validator
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/history"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              History
            </Link>
          </motion.div>
        </nav>
      </div>
    </div>
  )
}

