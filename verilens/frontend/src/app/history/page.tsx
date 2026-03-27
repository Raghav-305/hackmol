
"use client"

import { useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ScanHistory {
  id: string;
  filename: string;
  imageUrl: string;
  result: string;
  confidence: number;
  status: string;
  timestamp: Timestamp;
}

export default function HistoryPage() {
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();

  const historyQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'scans'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
  }, [db, user]);

  const { data: scans, loading: scansLoading } = useCollection<ScanHistory>(historyQuery);

  if (authLoading || (user && scansLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold">Scan History</h1>
          <p className="text-muted-foreground">Review your past forensic analysis reports.</p>
        </div>

        {!user ? (
          <Card className="glass-morphism border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
              <ShieldCheck className="w-16 h-16 text-muted-foreground/50" />
              <p className="text-xl font-medium">Please login to view your history</p>
              <Link href="/">
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium">
                  Go back to Home
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : !scans || scans.length === 0 ? (
          <Card className="glass-morphism border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
              <AlertCircle className="w-16 h-16 text-muted-foreground/50" />
              <p className="text-xl font-medium">No scan history found yet</p>
              <Link href="/">
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium">
                  Start your first scan
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-morphism border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Image</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow key={scan.id} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white/10">
                          <Image
                            src={scan.imageUrl}
                            alt={scan.filename}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{scan.filename}</TableCell>
                      <TableCell>
                        <Badge variant={scan.result === 'Real' ? 'default' : 'destructive'} className="uppercase text-[10px]">
                          {scan.result}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-bold">{Math.round(scan.confidence * 100)}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={scan.status === 'Verified' ? 'status-badge-verified' : 
                                     scan.status === 'Fake' ? 'status-badge-fake' : 'status-badge-modified'}
                        >
                          {scan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        <div className="flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" />
                          {scan.timestamp?.toDate().toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
