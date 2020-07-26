# upload-youtube
A ideia surgiu de uma necessidade pessoal de realizar ulpoads de video-aulas no youtube, sempre com a descrição e título com o mesmo padrão,
alterando somente o nome da matéria, data e o vídeo.

O programa faz autenticação oauth na conta do usuário, e tem pega as informações com o usuário de forma amigável, por uma pagina web local.

- Faz upload de arquivos de até 2GB (alterável no arquivo index.js, => form.maxFileSize = tamanho_em_bytes)

Para usar, basta:

- Garantir que as portas 3000 e 4000 estão liberadas;
  - A porta 3000 é usada pela api do google, e a porta 4000 usada para a interação e capturas de informações com o usuário.

- Usar a API do google "Youtube Data API v3";
  - Configurar a URL de origens JavaScript autorizada como "http://localhost:3000", sem aspas;
  - Configurar a URL de redirecionamento autorizado para "http://localhost:3000/oauth2callback", sem aspas;
    - Essa página pode ser personalizada, há uma função no programa com o trecho do código HTML dessa página.
  - Exportar as credenciais para pasta "/credentials", com o nome "google-youtube.json", sem aspas.

