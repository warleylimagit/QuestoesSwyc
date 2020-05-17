import { Injectable } from '@angular/core';
import { QuizModel } from '../app/models/quiz.model';
import { Config } from '../app/models/Config';
import { HttpClient } from '@angular/common/http';
import { resolve, reject } from 'q';

@Injectable({
    providedIn: 'root'
})

export class QuizService {
    public quizArray: any;
    constructor(private http: HttpClient) { }

    public async GetQuizzes() {
        return await new Promise((resolve, reject) => {
            this.http.get<Array<QuizModel>>('assets/form.json')
                .subscribe((data) => {
                    //this.quizArray = data;
                    resolve(data);
                },
                    error => {
                        if (error.status === 404) {
                            resolve(error.status);
                        }
                        else {
                            console.log('ocorreu um erro');
                        }
                    });
        });
    }
}