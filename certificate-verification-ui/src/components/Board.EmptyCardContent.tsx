import React, { useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { Box, Button, Typography } from '@mui/material';
import { TextPromptDialog } from './TextPromptDialog';

export interface EmptyCardContentProps {
  onCreateBoardCallback: () => void;
  onJoinBoardCallback: (contractAddress: ContractAddress) => void;
}

export const EmptyCardContent: React.FC<
  Readonly<EmptyCardContentProps>
> = ({
  onCreateBoardCallback,
  onJoinBoardCallback,
}) => {
  const [textPromptOpen, setTextPromptOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Start verifying certificates
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.7,
          }}
        >
          Create a new verification contract or connect to an
          existing Midnight contract.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onCreateBoardCallback}
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: 'none',
              background:
                'linear-gradient(135deg, #5b21b6, #7c3aed)',
            }}
          >
            Create Contract
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => setTextPromptOpen(true)}
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            Join Contract
          </Button>
        </Box>
      </Box>

      <TextPromptDialog
        prompt="Enter contract address"
        isOpen={textPromptOpen}
        onCancel={() => {
          setTextPromptOpen(false);
        }}
        onSubmit={(text) => {
          setTextPromptOpen(false);
          onJoinBoardCallback(text);
        }}
      />
    </>
  );
};