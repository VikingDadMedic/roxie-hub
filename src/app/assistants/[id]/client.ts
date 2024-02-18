import useSWR from 'swr';
import { useMemo } from 'react';
import { Assistant } from '@/app/types/assistant';
import { fetcher } from '@/app/utils/fetcher';
import { Message } from '@/app/types/message';

export function useGetAssistant(id: string) {
  let key = '/api/openai/assistants/' + id;

  let { data, isLoading, error, isValidating, mutate } = useSWR(key, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return useMemo(
    () => ({
      assistant: data as Assistant,
      assistantLoading: isLoading,
      assistantError: error,
      assistantValidating: isValidating,
      assistantEmpty: !isLoading && !data,
      reload: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );
}

export async function deleteAssistant(id: string) {
  let response = await fetch('/api/openai/assistants/' + id, {
    method: 'DELETE',
  });

  return [response.status, await response.json()];
}

export async function createThread(id: string | undefined) {
  if (!id) {
    return [400, { error: 'Assistant ID is required' }];
  }

  let response = await fetch('/api/openai/threads', {
    method: 'POST',
    headers: {
      accept: 'application.json',
      'Content-Type': 'application/json',
      'X-Assistant-Id': id || '',
    },
  });

  return [response.status, await response.json()];
}

export async function createRun(
  id: string | undefined,
  threadId: string | null
) {
  if (!id) {
    return [400, { error: 'Assistant ID is required' }];
  }

  if (!threadId) {
    return [400, { error: 'Thread ID is required' }];
  }

  let response = await fetch('/api/openai/threads/' + threadId + '/runs', {
    method: 'POST',
    headers: {
      accept: 'application.json',
      'Content-Type': 'application/json',
      'X-Assistant-Id': id || '',
    },
  });

  return [response.status, await response.json()];
}

export async function getRun(
  assistantId: string | undefined,
  threadId: string | undefined,
  id: string | undefined
) {
  if (!id) {
    return [400, { error: 'Run ID is required' }];
  }

  let response = await fetch(
    '/api/openai/threads/' + threadId + '/runs/' + id,
    {
      method: 'GET',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
        'X-Assistant-Id': assistantId || '',
      },
    }
  );

  return [response.status, await response.json()];
}

export async function createMessage(
  assistantId: string | undefined,
  threadId: string | null,
  message: Message | undefined
) {
  if (!message) {
    return [400, { error: 'Message is required' }];
  }

  let response = await fetch('/api/openai/threads/' + threadId + '/messages', {
    method: 'POST',
    headers: {
      accept: 'application.json',
      'Content-Type': 'application',
      'X-Assistant-Id': assistantId || '',
    },
    body: JSON.stringify({
      message: message,
    }),
  });

  return [response.status, await response.json()];
}

export async function getMessages(
  assistantId: string | undefined,
  threadId: string | undefined,
  after: string | undefined
) {
  if (!threadId) {
    return [400, { error: 'Thread ID is required' }];
  }

  let response = await fetch(
    '/api/openai/threads/' + threadId + '/messages?after=' + after,
    {
      method: 'GET',
      headers: {
        accept: 'application.json',
        'Content-Type': 'application/json',
        'X-Assistant-Id': assistantId || '',
      },
    }
  );

  return [response.status, await response.json()];
}