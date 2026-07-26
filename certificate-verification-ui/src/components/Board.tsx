import React, { useCallback, useEffect, useState } from 'react';
import { Buffer } from 'buffer';

import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

import {
  type ContractAddress,
} from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

import {
  type CertificateVerificationDerivedState,
  type DeployedCertificateVerificationAPI,
} from '../../../api/src/index.js';

import { CertificateState } from '../../../contract/src/index.js';
import { type CertificateDeployment } from '../contexts/index.js';
import { useDeployedBoardContext } from '../hooks/index.js';
import { type Observable } from 'rxjs';
import { EmptyCardContent } from './Board.EmptyCardContent.js';

export interface BoardProps {
  boardDeployment$?: Observable<CertificateDeployment>;
}

const hashTextToBytes32 = async (text: string): Promise<Uint8Array> => {
  const encoded = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return new Uint8Array(hash);
};

const bytesToHex = (value: Uint8Array | undefined): string => {
  if (!value) {
    return 'Not issued yet';
  }

  return Buffer.from(value).toString('hex');
};

export const Board: React.FC<Readonly<BoardProps>> = ({
  boardDeployment$,
}) => {
  const provider = useDeployedBoardContext();

  const [deployment, setDeployment] =
    useState<CertificateDeployment>();

  const [api, setApi] =
    useState<DeployedCertificateVerificationAPI>();

  const [state, setState] =
    useState<CertificateVerificationDerivedState>();

  const [certificateText, setCertificateText] = useState('');
  const [verificationResult, setVerificationResult] =
    useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isWorking, setIsWorking] =
    useState(!!boardDeployment$);

  const onCreate = useCallback(
    () => provider.resolve(),
    [provider],
  );

  const onJoin = useCallback(
    (contractAddress: ContractAddress) =>
      provider.resolve(contractAddress),
    [provider],
  );

  useEffect(() => {
    if (!boardDeployment$) return;

    const subscription =
      boardDeployment$.subscribe(setDeployment);

    return () => subscription.unsubscribe();
  }, [boardDeployment$]);

  useEffect(() => {
    if (!deployment) return;

    if (deployment.status === 'in-progress') {
      return;
    }

    setIsWorking(false);

    if (deployment.status === 'failed') {
      setErrorMessage(deployment.error.message);
      return;
    }

    setApi(deployment.api);

    const subscription =
      deployment.api.state$.subscribe(setState);

    return () => subscription.unsubscribe();
  }, [deployment]);

  const issueCertificate = useCallback(async () => {
    if (!api || !certificateText.trim()) return;

    try {
      setIsWorking(true);
      setErrorMessage(undefined);

      const hash =
        await hashTextToBytes32(certificateText);

      await api.issueCertificate(hash);

      setVerificationResult(
        'Certificate issued successfully.',
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : String(error),
      );
    } finally {
      setIsWorking(false);
    }
  }, [api, certificateText]);

  const verifyCertificate = useCallback(async () => {
    if (!api || !certificateText.trim()) return;

    try {
      setIsWorking(true);
      setErrorMessage(undefined);

      const hash =
        await hashTextToBytes32(certificateText);

      await api.verifyCertificate(hash);

      setVerificationResult(
        '✅ Genuine certificate — verified successfully.',
      );
    } catch {
      setVerificationResult(
        '❌ Fake, revoked, or incorrect certificate.',
      );
    } finally {
      setIsWorking(false);
    }
  }, [api, certificateText]);

  const revokeCertificate = useCallback(async () => {
    if (!api) return;

    try {
      setIsWorking(true);
      setErrorMessage(undefined);

      await api.revokeCertificate();

      setVerificationResult(
        'Certificate revoked successfully.',
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : String(error),
      );
    } finally {
      setIsWorking(false);
    }
  }, [api]);

  const copyContractAddress = useCallback(async () => {
    if (!api) return;

    await navigator.clipboard.writeText(
      api.deployedContractAddress,
    );
  }, [api]);

  // FIRST SCREEN
  if (!boardDeployment$) {
    return (
      <Card
        elevation={0}
        sx={{
          width: 'min(92vw, 650px)',
          borderRadius: 5,
          overflow: 'hidden',
          border: '1px solid rgba(124,58,237,0.18)',
          boxShadow: '0 25px 70px rgba(44,25,90,0.18)',
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 5,
            textAlign: 'center',
            color: 'white',
            background:
              'linear-gradient(135deg, #1e1235 0%, #4c1d95 55%, #7c3aed 100%)',
          }}
        >
          <Box
            sx={{
              width: 75,
              height: 75,
              borderRadius: 4,
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.12)',
            }}
          >
            <VerifiedUserOutlinedIcon
              sx={{ fontSize: 44 }}
            />
          </Box>

          <Typography
            variant="h3"
            sx={{ fontWeight: 800 }}
          >
            CertiGuard
          </Typography>

          <Typography
            sx={{
              mt: 1,
              opacity: 0.8,
              lineHeight: 1.7,
            }}
          >
            Privacy-preserving certificate verification
            powered by Midnight Network.
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <EmptyCardContent
            onCreateBoardCallback={onCreate}
            onJoinBoardCallback={onJoin}
          />
        </Box>

        <Box
          sx={{
            pb: 3,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Chip
            icon={<SecurityOutlinedIcon />}
            label="Powered by Midnight"
            variant="outlined"
          />
        </Box>
      </Card>
    );
  }

  const statusLabel =
    state?.state === CertificateState.VALID
      ? 'VALID'
      : state?.state === CertificateState.REVOKED
        ? 'REVOKED'
        : 'NOT ISSUED';

  return (
    <Card
      elevation={0}
      sx={{
        width: 'min(94vw, 780px)',
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden',
        border: '1px solid rgba(124,58,237,0.15)',
        boxShadow: '0 25px 70px rgba(44,25,90,0.18)',
      }}
    >
      <Backdrop
        open={isWorking}
        sx={{
          position: 'absolute',
          zIndex: 20,
          color: 'white',
          background: 'rgba(30,18,53,0.82)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: 'white' }} />

          <Typography>
            Processing on Midnight...
          </Typography>
        </Box>
      </Backdrop>

      {/* HEADER */}
      <Box
        sx={{
          px: 4,
          py: 3,
          color: 'white',
          background:
            'linear-gradient(135deg, #1e1235, #5b21b6)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <VerifiedUserOutlinedIcon />

              <Typography
                variant="h5"
                sx={{ fontWeight: 800 }}
              >
                CertiGuard
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ opacity: 0.75, mt: 0.5 }}
            >
              Certificate Verification DApp
            </Typography>
          </Box>

          {state && (
            <Chip
              label={statusLabel}
              color={
                state.state === CertificateState.VALID
                  ? 'success'
                  : state.state ===
                      CertificateState.REVOKED
                    ? 'error'
                    : 'default'
              }
              sx={{ fontWeight: 800 }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {!state ? (
          <Box>
            <Skeleton
              variant="rounded"
              height={60}
              sx={{ mb: 2 }}
            />

            <Skeleton
              variant="rounded"
              height={180}
              sx={{ mb: 2 }}
            />

            <Skeleton
              variant="rounded"
              height={60}
            />
          </Box>
        ) : (
          <Box>
            {/* CONTRACT */}
            <Box
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 3,
                background: '#f7f5ff',
                border: '1px solid #e8e0ff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    CONTRACT ADDRESS
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {api
                      ? `${api.deployedContractAddress.slice(
                          0,
                          20,
                        )}...`
                      : 'Pending'}
                  </Typography>
                </Box>

                {api && (
                  <Tooltip title="Copy contract address">
                    <IconButton
                      onClick={copyContractAddress}
                    >
                      <ContentCopyOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {/* INPUT */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 750 }}
            >
              Certificate Details
            </Typography>

            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                mt: 0.5,
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Enter the exact certificate information.
              CertiGuard generates a SHA-256 fingerprint
              before interacting with Midnight.
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Certificate information"
              placeholder={
                'Student: Rahul Sharma\nCourse: Blockchain Fundamentals\nCertificate ID: CERT-2026-001\nInstitution: Example University\nIssue Date: 26 July 2026'
              }
              value={certificateText}
              onChange={(event) => {
                setCertificateText(event.target.value);
                setVerificationResult(undefined);
                setErrorMessage(undefined);
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />

            {/* BUTTONS */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr 1fr',
                },
                gap: 1.5,
                mb: 3,
              }}
            >
              <Button
                size="large"
                variant="contained"
                startIcon={<AddTaskOutlinedIcon />}
                disabled={
                  !api || !certificateText.trim()
                }
                onClick={issueCertificate}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg,#5b21b6,#7c3aed)',
                }}
              >
                Issue Certificate
              </Button>

              <Button
                size="large"
                variant="outlined"
                startIcon={<SearchOutlinedIcon />}
                disabled={
                  !api || !certificateText.trim()
                }
                onClick={verifyCertificate}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Verify
              </Button>

              <Button
                size="large"
                variant="outlined"
                color="error"
                startIcon={<BlockOutlinedIcon />}
                disabled={
                  !api ||
                  state.state !==
                    CertificateState.VALID ||
                  !state.isIssuer
                }
                onClick={revokeCertificate}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Revoke
              </Button>
            </Box>

            {verificationResult && (
              <Alert
                severity={
                  verificationResult.includes('Fake')
                    ? 'error'
                    : verificationResult.includes(
                          'revoked',
                        )
                      ? 'warning'
                      : 'success'
                }
                sx={{
                  mb: 3,
                  borderRadius: 3,
                }}
              >
                {verificationResult}
              </Alert>
            )}

            {errorMessage && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 3,
                }}
              >
                {errorMessage}
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {/* HASH */}
            <Typography
              variant="caption"
              color="text.secondary"
            >
              CERTIFICATE FINGERPRINT
            </Typography>

            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                background: '#f8fafc',
                fontFamily: 'monospace',
                fontSize: 13,
                wordBreak: 'break-all',
              }}
            >
              {bytesToHex(state.certificateHash)}
            </Box>

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <SecurityOutlinedIcon
                fontSize="small"
                color="action"
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Privacy-preserving verification powered by
                Midnight
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};