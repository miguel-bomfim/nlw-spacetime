import { useEffect } from 'react';
import { useRouter} from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/6fc245b7020b8f53f9de',
};

export default function App() {
  const router = useRouter()


  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '6fc245b7020b8f53f9de',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

  const handleGithubOAuthCode= async (code: string) => {
    const res = await api.post('/register', {
      code,
    })

    const {token} = res.data
      
    SecureStore.setItemAsync('token', token);

    router.push('/memories')
  }


  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      handleGithubOAuthCode(code)
    }
  }, [response]);

  return (
    <View
      className='py-10 flex-1 items-center'
    >
      <View className='flex-1 items-center justify-center gap-6'>
        < NLWLogo/>
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>Sua cápsula do tempo</Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.7} className='rounded-full bg-green-500 px-5 py-2' onPress={() => signInWithGithub()}>
          <Text className='font-alt text-sm uppercase text-black'>Cadastrar lembrança</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>Feito com 💜 no NLW da Rocketseat</Text>
    </View>
  );
}
