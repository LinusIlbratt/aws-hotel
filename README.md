# Hotel Booking API

Detta är ett serverless-projekt för ett hotellboknings-API.

## Projektbeskrivning

Detta API är skapat för att hantera hotellbokningar och rumsbokningar i en serverless arkitektur på AWS. API:et använder AWS-tjänster som **API Gateway**, **AWS Lambda** och **DynamoDB** för att hantera backend-logiken utan behov av traditionella servrar.

API:et är designat för att skalas upp och ned automatiskt beroende på efterfrågan, vilket gör det lämpligt för ett hotell där bokningar kan variera under dagen eller året.

## Fokus på MVP (Minimal Viable Product)

Detta API är designat som en MVP och syftar till att ge grundläggande funktionalitet för hotellbokningar. För närvarande är **datumhantering** för bokningar, inklusive när rum blir upptagna eller lediga, **inte inkluderat** i denna version. 

Vi är medvetna om att en fullständig lösning skulle behöva en mer avancerad hantering av bokningstidpunkter och rumstillgänglighet baserat på datum och annan funktionalitet. Detta kan läggas till i framtida versioner av API:et.

## Funktionalitet

API:et tillhandahåller följande funktionalitet:

- Boka rum baserat på antalet gäster och rumstyp
- Hantera olika typer av rum (enkelrum, dubbelrum och sviter) med pris per natt
- Kontrollera tillgängliga rum
- Avboka bokningar

## API-dokumentation

API-dokumentationen finns tillgänglig via SwaggerHub, där du kan se detaljerad information om alla endpoints samt anropsexempel.

[Länk till Swagger-dokumentation](https://app.swaggerhub.com/apis/MA23-AWS-Hotel/hotel-booking_api/1.0.0)
