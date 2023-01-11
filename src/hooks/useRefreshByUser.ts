import { useState } from 'react';

export const useRefreshByUser = (refetch: () => void) => {
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  const refetchByUser = async () => {
    setIsRefetchingByUser(true);

    try {
      await refetch();
    } finally {
      setIsRefetchingByUser(false);
    }
  };

  return {
    isRefetchingByUser,
    refetchByUser,
  };
};
