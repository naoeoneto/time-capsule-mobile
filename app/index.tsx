import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  useFonts, // pode ser importada de qualquer pacote
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import bgBlur from "../src/assets/bgBlur.png";
import Stripes from "../src/assets/stripes.svg";
import { styled } from "nativewind";
import NLWLogo from "../src/assets/nlwLogo.svg";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import { api } from "../src/lib/api";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router"; // Para redirecionar o usuário depois do login.

const StyledStripes = styled(Stripes);

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/ce45ffcffb0326ab4f95",
};

export default function App() {
  const router = useRouter();

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });
  // no react native não é possível controlar o peso da fonte através de comandos como 'font-bold'. Quem faz isso é a própria importação, por isso que o font-weight vem logo após o nome da fonte.

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "ce45ffcffb0326ab4f94",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  async function handleGithubOauthCode(code: string) {
    const response = await api.post("/register", { code });

    const { token } = response.data;
    await SecureStore.setItemAsync("token", token);
    router.push("/memories"); // Para onde o usuário será redirecionado
  }

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: "nlwspacetime",
    //   })
    // );

    // console.log("oi", response);
    if (response?.type === "success") {
      const { code } = response.params;
      handleGithubOauthCode(code);
    }
  }, [response]);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <ImageBackground
      source={bgBlur}
      className="relative flex-1 items-center bg-gray-950 px-8 py-10"
      imageStyle={{ position: "absolute", left: "-100%" }} // permite adicionar uma estilização para a imagem
    >
      <StyledStripes className="absolute left-2" />
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
        >
          <Text
            className="font-alt text-sm uppercase text-black"
            onPress={() => signInWithGithub()} // onClick existe apenas em aplicações web. Para mobile, utilizamos onPress.
          >
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
      <StatusBar style="light" translucent />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
