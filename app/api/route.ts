import { NextRequest, NextResponse } from 'next/server'

// API Routes Index
const apiRoutes = [
  {
    endpoint: '/api/packages',
    method: 'GET',
    description: 'Get all travel packages',
    public: true
  },
  {
    endpoint: '/api/events', 
    method: 'GET',
    description: 'Get all events and activities',
    public: true
  },
  {
    endpoint: '/api/contact',
    method: 'POST', 
    description: 'Send contact form',
    public: true
  },
  {
    endpoint: '/api/package-categories',
    method: 'GET',
    description: 'Get package categories',
    public: true
  }
];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'AFI Travel & Tourism API',
    version: '1.0.0',
    routes: apiRoutes.filter(route => route.public)
  });
}
