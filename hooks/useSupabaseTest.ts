import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabaseTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult('🔍 Iniciando diagnóstico...');

    try {
      // Step 1: Check configuration
      console.log('Step 1: Checking Supabase config...');
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        setTestResult('❌ Variables de entorno faltantes');
        console.error('Missing env vars:', { url: !!url, key: !!key });
        return;
      }
      
      setTestResult('🔍 Config OK, probando conexión...');
      console.log('Supabase URL:', url);
      console.log('Key length:', key.length);
      
      // Step 2: Test basic connectivity
      console.log('Step 2: Testing network connectivity...');
      const response = await fetch(url + '/rest/v1/', {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      console.log('Network response status:', response.status);
      
      if (!response.ok) {
        setTestResult(`❌ HTTP Error: ${response.status}`);
        return;
      }
      
      setTestResult('🔍 Red OK, probando Supabase...');
      
      // Step 3: Test Supabase client
      console.log('Step 3: Testing Supabase client...');
      
      // Try simple query without timeout
      const { data: altData, error: altError } = await supabase
        .from('businesses')
        .select('count');
        
      console.log('Query result:', { altData, altError });
      
      if (altError) {
        setTestResult(`❌ Supabase Error: ${altError.message}`);
        return;
      }
      
      if (altData) {
        setTestResult(`✅ ¡Conexión exitosa! Encontrados ${altData[0]?.count || 0} registros`);
        console.log('Supabase working!');
        return;
      }
      
      setTestResult('✅ ¡Conexión exitosa!');
      console.log('All tests passed!');
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Error: ${errorMsg}`);
      console.error('Test error:', error);
    } finally {
      setTesting(false);
    }
  };

  return {
    testResult,
    testing,
    testConnection
  };
};