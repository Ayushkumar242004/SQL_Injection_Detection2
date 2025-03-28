"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { motion } from "framer-motion"

export default function HistoryPage() {
  const [history, setHistory] = useState<{ query: string; model: string; isMalicious: boolean; message: string; timestamp: string }[]>([])

  // Load query history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("queryValidationHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
        <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Query History
          </motion.h2>
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>View and manage your previously validated SQL queries</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No query history available.</TableCell>
                  </TableRow>
                ) : (
                  history.map((item, index) => (
                    
                    <TableRow key={index}>
                      <TableCell className="font-medium">{new Date(item.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-md truncate">{item.query}</TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>
                        <Badge variant={item.isMalicious ? "destructive" : "secondary"}>
                          {item.isMalicious ? "Malicious" : "Safe"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
