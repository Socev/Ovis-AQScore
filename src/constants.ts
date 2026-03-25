export interface Question {
  id: number;
  text: string;
  reverse: boolean;
}

export const AQ_QUESTIONS: Question[] = [
  { id: 1, text: "Ik doe dingen liever met anderen dan alleen.", reverse: false },
  { id: 2, text: "Ik doe dingen het liefst steeds weer op dezelfde manier.", reverse: true },
  { id: 3, text: "Als ik me iets probeer voor te stellen, kan ik me makkelijk een beeld voor de geest halen.", reverse: false },
  { id: 4, text: "Ik word vaak zo door iets in beslag genomen, dat ik andere zaken uit het oog verlies.", reverse: true },
  { id: 5, text: "Ik merk vaak geluidjes op die anderen niet opvallen.", reverse: true },
  { id: 6, text: "Mijn aandacht wordt vaak getrokken door nummerplaten van auto’s, of soortgelijke rijtjes.", reverse: true },
  { id: 7, text: "Andere mensen zeggen me vaak dat het onbeleefd is wat ik heb gezegd, terwijl ik zelf denk beleefd te zijn.", reverse: true },
  { id: 8, text: "Als ik een verhaal lees, kan ik me gemakkelijk voorstellen hoe de personages eruit zouden kunnen zien.", reverse: false },
  { id: 9, text: "Ik word gefascineerd door jaartallen en data.", reverse: true },
  { id: 10, text: "In een groep mensen kan ik gemakkelijk verschillende gesprekken tegelijk volgen.", reverse: false },
  { id: 11, text: "Ik vind sociale situaties gemakkelijk.", reverse: false },
  { id: 12, text: "Mij vallen vaak details op die anderen niet zien.", reverse: true },
  { id: 13, text: "Ik zou liever naar een bibliotheek gaan dan naar een feest.", reverse: true },
  { id: 14, text: "Ik vind het gemakkelijk om verhalen te verzinnen.", reverse: false },
  { id: 15, text: "Ik voel me meer aangetrokken tot mensen dan tot dingen.", reverse: false },
  { id: 16, text: "Ik neig ernaar zeer sterke interesses te hebben, en ik raak van streek als ik die niet kan naleven.", reverse: true },
  { id: 17, text: "Ik geniet van praten over koetjes en kalfjes.", reverse: false },
  { id: 18, text: "Als ik praat, is het voor anderen niet altijd gemakkelijk om er een woord tussen te krijgen.", reverse: true },
  { id: 19, text: "Ik word gefascineerd door getallen.", reverse: true },
  { id: 20, text: "Als ik een verhaal lees, vind ik het moeilijk om achter de bedoelingen van de personages te komen.", reverse: true },
  { id: 21, text: "Ik ben niet echt een liefhebber van het lezen van romans.", reverse: true },
  { id: 22, text: "Ik vind het moeilijk om nieuwe vrienden te maken.", reverse: true },
  { id: 23, text: "Ik merk steeds patronen op in dingen die ik zie.", reverse: true },
  { id: 24, text: "Ik zou liever naar het theater gaan dan naar een museum.", reverse: false },
  { id: 25, text: "Ik raak niet van streek als mijn dagelijkse routine wordt verstoord.", reverse: false },
  { id: 26, text: "Ik merk vaak dat ik niet weet hoe ik een conversatie gaande moet houden.", reverse: true },
  { id: 27, text: "Ik vind het gemakkelijk om ‘tussen de regels door te luisteren’ als iemand tegen mij praat.", reverse: false },
  { id: 28, text: "Gewoonlijk concentreer ik me meer op het hele beeld dan op de kleine details.", reverse: false },
  { id: 29, text: "Ik ben niet erg goed in het onthouden van telefoonnummers.", reverse: false },
  { id: 30, text: "Kleine veranderingen in situaties, of in hoe iemand eruit ziet, merk ik meestal niet op.", reverse: false },
  { id: 31, text: "Ik kan merken wanneer iemand die naar me luistert, verveeld raakt.", reverse: false },
  { id: 32, text: "Ik vind het gemakkelijk om meer dan één ding tegelijk te doen.", reverse: false },
  { id: 33, text: "Als ik telefoneer, ben ik er niet zeker van wanneer het mijn beurt is om iets te zeggen.", reverse: true },
  { id: 34, text: "Ik vind het leuk spontaan iets te ondernemen.", reverse: false },
  { id: 35, text: "Ik ben vaak de laatste die de clou van een grap begrijpt.", reverse: true },
  { id: 36, text: "Ik vind het gemakkelijk om erachter te komen wat iemand denkt of voelt, alleen door naar zijn of haar gezicht te kijken.", reverse: false },
  { id: 37, text: "Na een onderbreking kan ik heel snel terugschakelen naar waar ik mee bezig was.", reverse: false },
  { id: 38, text: "Ik ben goed in praten over koetjes en kalfjes.", reverse: false },
  { id: 39, text: "Mensen vertellen me vaak dat ik maar door blijf gaan over hetzelfde onderwerp.", reverse: true },
  { id: 40, text: "Toen ik klein was, vond ik het leuk om ‘doen-alsof’-spelletjes met andere kinderen te spelen.", reverse: false },
  { id: 41, text: "Ik vind het leuk om informatie te verzamelen over bepaalde categorieën van dingen (bijv. automerken, vogel-, trein-, plantensoorten, etc.)", reverse: true },
  { id: 42, text: "Ik vind het moeilijk om me voor te stellen hoe het zou zijn als ik iemand anders was.", reverse: true },
  { id: 43, text: "Ik vind het prettig om alle activiteiten, waaraan ik deelneem, zorgvuldig te plannen.", reverse: true },
  { id: 44, text: "Ik geniet van sociale gebeurtenissen.", reverse: false },
  { id: 45, text: "Ik vind het moeilijk om achter de bedoelingen van anderen te komen.", reverse: true },
  { id: 46, text: "Nieuwe situaties maken me angstig.", reverse: true },
  { id: 47, text: "Ik vind het leuk om nieuwe mensen te ontmoeten.", reverse: false },
  { id: 48, text: "Ik ben een goede diplomaat.", reverse: false },
  { id: 49, text: "Ik ben er niet erg goed in de geboortedata van anderen te onthouden.", reverse: false },
  { id: 50, text: "Ik vind het erg gemakkelijk om ‘doen-alsof’-spelletjes met kinderen te spelen.", reverse: false },
];

export const SUBSCALES = {
  social: [1, 11, 13, 15, 22, 36, 44, 45, 47, 48],
  switching: [2, 4, 10, 16, 25, 32, 34, 37, 43, 46],
  communication: [7, 17, 18, 26, 27, 31, 33, 35, 38, 39],
  imagination: [3, 8, 14, 20, 21, 24, 40, 41, 42, 50],
  detail: [5, 6, 9, 12, 19, 23, 28, 29, 30, 49],
};

export const POPULATION_DATA = {
  men: {
    ass: { total: 134.29, social: 29.35, switching: 28.34, communication: 25.74, imagination: 25.06, detail: 25.47 },
    none: { total: 95.23, social: 18.76, switching: 19.45, communication: 16.53, imagination: 19.56, detail: 20.62 },
  },
  women: {
    ass: { total: 140.41, social: 30.76, switching: 30.12, communication: 27.82, imagination: 24.59, detail: 27.12 },
    none: { total: 85.44, social: 17.2, switching: 17.04, communication: 15.19, imagination: 16.2, detail: 20.35 },
  }
};
