# TESTE LUX - GABRIEL BARBAN

## 1) DEPLOY

Vou ser sincero: tive alguns problemas para fazer o deploy inicial do projeto. Cheguei a tentar criar um docker-compose.yml próprio antes de solicitar ajuda ao Tiago, mas estava dando muitos erros nas dependências, principalmente do lado do React.
A solução foi fazer ajustes nos Dockerfiles tanto do frontend quanto do backend, onde eliminei a flag --only=production do npm install. Essa flag estava impedindo o download de todas as dependências no ambiente local, causando falhas no build. Com a remoção dessa restrição, consegui baixar todas as dependências necessárias e o projeto passou a buildar corretamente.

## 2) BUG DAS DATAS EM PAGAMENTO

Admito que foi um pouco complicado entender esse bug, pela falta de informações, mas com certeza um problema que identifiquei foi na função `formatDate` localizada em `frontend/src/pages/Payments.tsx`. A função estava fazendo uma subtração desnecessária do timezone offset:

```typescript
// CÓDIGO COM BUG
const adjustedDate = new Date(
  date.getTime() - date.getTimezoneOffset() * 60000
);
```

Esse ajuste manual estava causando dupla correção de timezone, pois o JavaScript já faz essa conversão automaticamente através do `toLocaleString()`. A solução aplicada foi a remoção completa desse ajuste e utilização da abordagem mais convencional possível:

```typescript
// SOLUÇÃO IMPLEMENTADA
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'Invalid date';
  }
};
```

## 3) FILTRO POR PRÉDIO EM APARTAMENTOS

Foi implementado um filtro por prédio na página `ApartmentOwners.tsx` conforme solicitado. A implementação consistiu em:

1. **Estado do filtro**: Adição de `selectedBuildingFilter` para controlar a selecção
2. **Query GraphQL**: Utilização da query `GET_BUILDINGS` já existente
3. **Lógica de filtro**: Comparação do `building.id` dos proprietários com o filtro seleccionado
4. **Interface**: Select dropdown com opção "All Buildings" e lista de prédios disponíveis

```typescript
const filteredOwners = selectedBuildingFilter 
  ? data?.apartmentOwners.filter((owner: ApartmentOwner) => 
      owner.building?.id === selectedBuildingFilter
    )
  : data?.apartmentOwners;
```

O filtro segue o padrão Material-UI existente e mantém consistência com o design da aplicação.

## 4) FUNCIONALIDADES BONUS QUE IMPLEMENTEI

### Filtros Múltiplos em Pagamentos

Foram implementados três filtros na página de pagamentos para melhorar a experiência do usuário:

- **Filtro por Status**: Permite filtrar por pending, paid ou overdue
- **Filtro por Mês**: Lista sequencial de meses de 2020-01 até 2030-12
- **Filtro por Proprietário**: Todos os apartment owners cadastrados

Um detalhe interessante sobre esses filtros é que eles sao client-side, o que deixa mais rápido

### Campo de Mês com Calendário Nativo

O campo de inserção de mês foi substituído por um input HTML5 nativo:

```typescript
<TextField
  fullWidth
  label="Mês de Pagamento"
  type="month"
  value={formData.month}
  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
  inputProps={{
    min: "2020-01",
```

## 5) OUTROS BUGS/MELHORIAS/SUGESTÕES

Além do bug em pagamentos, também encontrei outros pontos testando a aplicação:

- **Ao clicar em atualizar um registro, em Payments, caso seja alterado o apartment owner, essa informação não fica salva e é perdida ao atualizar a tela.**
- **O campo phone number, na tela Apartment Owners, não tem máscara e também não tem nenhuma validação de número de telemóvel.**
- **No cadastro e na edição de todos os 3 CRUDS (Buildings, Apartment Owners e Payments) não esta claro quais são os campos obrigatórios que o usuário precisa preencher para fazer submit.**


