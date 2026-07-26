import { useContext } from 'react';

import {
  DeployedBoardContext,
  type DeployedCertificateAPIProvider,
} from '../contexts/index.js';

export const useDeployedBoardContext =
  (): DeployedCertificateAPIProvider => {
    const context = useContext(
      DeployedBoardContext,
    );

    if (!context) {
      throw new Error(
        'A <DeployedBoardProvider /> is required.',
      );
    }

    return context;
  };