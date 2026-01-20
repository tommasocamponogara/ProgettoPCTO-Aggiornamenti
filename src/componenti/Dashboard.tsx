import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { Sidebar } from './sidebar'

export function Dashboard() {
  return (
    <>
      <Sidebar />
    </>
  )
}
