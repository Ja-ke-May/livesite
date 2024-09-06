
"use client";

import React, { Suspense } from 'react';
import ResetPassword from './components/ResetPassword';

export default function ResetPasswordPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
    );
  }