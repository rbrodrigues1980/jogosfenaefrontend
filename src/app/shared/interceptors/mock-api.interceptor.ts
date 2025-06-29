import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { EditionDto, CompanyDto } from '../types/common';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Se o backend não estiver disponível, retornar dados mock
  if (req.url.includes('/api/rest/v1/edition')) {
    const mockEditions: EditionDto[] = [
      {
        id: 1,
        createdDateTime: new Date().toISOString(),
        updatedDateTime: new Date().toISOString(),
        title: 'Jogos FENAE 2024',
        startDateTime: '2024-06-01T08:00:00',
        endDateTime: '2024-06-05T18:00:00',
        membershipDate: '2024-05-01',
        bornFrom: '1980-01-01',
        bornUntil: '2005-12-31',
        linkExpirationDate: '2024-05-31T23:59:59',
        link: 'https://jogosfenae2024.com',
        description: 'Edição 2024 dos Jogos FENAE',
        email: 'contato@fenae.com.br',
        currentEdition: true
      },
      {
        id: 2,
        createdDateTime: new Date().toISOString(),
        updatedDateTime: new Date().toISOString(),
        title: 'Jogos FENAE 2023',
        startDateTime: '2023-06-01T08:00:00',
        endDateTime: '2023-06-05T18:00:00',
        membershipDate: '2023-05-01',
        bornFrom: '1980-01-01',
        bornUntil: '2004-12-31',
        linkExpirationDate: '2023-05-31T23:59:59',
        link: 'https://jogosfenae2023.com',
        description: 'Edição 2023 dos Jogos FENAE',
        email: 'contato@fenae.com.br',
        currentEdition: false
      }
    ];

    return of(new HttpResponse({ body: mockEditions }));
  }

  if (req.url.includes('/api/rest/v1/company')) {
    const mockCompanies: CompanyDto[] = [
      {
        id: '1',
        createdDateTime: new Date().toISOString(),
        updatedDateTime: new Date().toISOString(),
        title: 'APCEF/SP',
        participantNumber: 150,
        presidentNumber: 2,
        sportsDirectorNumber: 3,
        athleteNumber: 120,
        parathleteNumber: 15,
        technicalNumber: 10,
        edition: {
          id: 1,
          title: 'Jogos FENAE 2024'
        } as EditionDto
      },
      {
        id: '2',
        createdDateTime: new Date().toISOString(),
        updatedDateTime: new Date().toISOString(),
        title: 'APCEF/RJ',
        participantNumber: 120,
        presidentNumber: 2,
        sportsDirectorNumber: 2,
        athleteNumber: 95,
        parathleteNumber: 12,
        technicalNumber: 9,
        edition: {
          id: 1,
          title: 'Jogos FENAE 2024'
        } as EditionDto
      }
    ];

    return of(new HttpResponse({ body: mockCompanies }));
  }

  // Para outras requisições, continuar normalmente
  return next(req);
};
