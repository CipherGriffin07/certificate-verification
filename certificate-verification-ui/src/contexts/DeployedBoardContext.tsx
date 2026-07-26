import React, {
  type PropsWithChildren,
  createContext,
} from 'react';

import {
  type DeployedCertificateAPIProvider,
  BrowserDeployedCertificateManager,
} from './BrowserDeployedBoardManager.js';

import { type Logger } from 'pino';

export const DeployedBoardContext =
  createContext<
    DeployedCertificateAPIProvider | undefined
  >(undefined);

export type DeployedBoardProviderProps =
  PropsWithChildren<{
    logger: Logger;
  }>;

export const DeployedBoardProvider:
  React.FC<
    Readonly<DeployedBoardProviderProps>
  > = ({
    logger,
    children,
  }) => (
    <DeployedBoardContext.Provider
      value={
        new BrowserDeployedCertificateManager(
          logger,
        )
      }
    >
      {children}
    </DeployedBoardContext.Provider>
  );