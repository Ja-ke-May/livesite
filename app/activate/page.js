
"use client";

import React, { Suspense } from 'react';
import ActivateAccount from './components/ActivateAccount';

export default function ActivatePage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ActivateAccount />
      </Suspense>
    );
  }