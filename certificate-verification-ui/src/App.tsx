import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { MainLayout, Board } from './components';
import { useDeployedBoardContext } from './hooks';
import { type CertificateDeployment } from './contexts';
import { type Observable } from 'rxjs';

const App: React.FC = () => {
  const certificateApiProvider = useDeployedBoardContext();

  const [certificateDeployments, setCertificateDeployments] =
    useState<Array<Observable<CertificateDeployment>>>([]);

  useEffect(() => {
    const subscription =
      certificateApiProvider.certificateDeployments$.subscribe(
        setCertificateDeployments,
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [certificateApiProvider]);

  return (
    <Box sx={{ background: '#f5f7fb', minHeight: '100vh' }}>
      <MainLayout>
        {certificateDeployments.map((deployment, idx) => (
          <div key={`certificate-${idx}`}>
            <Board boardDeployment$={deployment} />
          </div>
        ))}

        <Board />
      </MainLayout>
    </Box>
  );
};

export default App;