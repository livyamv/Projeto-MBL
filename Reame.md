# Como rodar o app no celular

## Passo a passo

1.**Baixe o projeto**
No computador, abra o terminal(botão esquerdo e Open Git Bash Here) e digite:
git clone https://github.com/seu-usuario/seu-projeto.git

Lembrando que antes de clonar, é preciso que esteja configurado de acordo com o nome de usuario e email do GitHub
git config --global user.name ...
git config --global user.email ...

*Depois de clonar*
cd seu-projeto -> Para entrar na pasta do projeto indicado

2.**Instalando as dependências**
No terminal digite:
npm install

4.**Instale o projeto no Android Studio**
Abra o aplicativo Android Studio no computador -> More Actions -> Virtual Device Manager
Em outra tela, irá clicar no Galaxy Mini API 33, clique na seta e espere que irá abrir um emulador de celular.
Assim que abrir, clique no botão de inicar e espere.

5.**Rodar o projeto**
No terminal do VsCode e inicie o projeto:
npx expo start

E agora você consegue rodar o app no emulador.