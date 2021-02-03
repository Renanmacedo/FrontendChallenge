import { trigger, style, state, transition, keyframes, query, animate } from '@angular/animations';


export const fadeIn = [
    trigger('fadeIn', [

        state('navigationIn',
            style({
                opacity: 1
            })
        ),
        transition(':enter', [
            animate(600, keyframes([
                style({ opacity: 0, transform: 'translateY(100px)' })
                , style({ opacity: .1, transform: 'translateY(80px)' })
                , style({ opacity: .2, transform: 'translateY(70px)' })
                , style({ opacity: .3, transform: 'translateY(60px)' })
                , style({ opacity: .4, transform: 'translateY(50px)' })
                , style({ opacity: .5, transform: 'translateY(40px)' })
                , style({ opacity: .6, transform: 'translateY(30px)' })
                , style({ opacity: .7, transform: 'translateY(20px)' })
                , style({ opacity: .8, transform: 'translateY(10px)' })
                , style({ opacity: 1, transform: 'translateY(0px)' })
            ]))
        ])
    ])
];
export const _fadeIn = [
    trigger('fadeIn', [
        state('navigationIn', style({ opacity: 1 }))
        , transition(':enter', [
            animate(1000, keyframes([
                style({ opacity: 0, transform: 'translateY(-150px)', offset: 0 })
                , style({ opacity: .1, transform: 'translateY(-120px)', offset: .1 })
                , style({ opacity: .2, transform: 'translateY(-100px)', offset: .2 })
                , style({ opacity: .3, transform: 'translateY(-80px)', offset: .3 })
                , style({ opacity: .4, transform: 'translateY(-40px)', offset: .4 })
                , style({ opacity: .5, transform: 'translateY(-30px)', offset: .5 })
                , style({ opacity: .6, transform: 'translateY(-20px)', offset: .6 })
                , style({ opacity: .7, transform: 'translateY(-10px)', offset: .7 })
                , style({ opacity: 1, transform: 'translateY(0px)', offset: 1 })
            ]))
        ])
    ])
];


export const rotateAnimation = [
    trigger('rotateAnimation', [
        state(':enter', 
            style({ transform: 'rotate({{ rad }})' }), { params: { rad: '0deg' } })
        ,state(':leave', 
            style({ transform: 'rotate({{ rad }})' }), { params: { rad: '0deg' } })
        , transition("* => *" , animate(200))
    ])
];
export const collapseAnimation = [
    trigger('bodyAnimation', [
        state('expanded', style({ height: '*', visibility: 'visible' }))
        , state('collapse', style({ height: '0px', visibility: 'hidden' }))
        , transition('expanded => collapse', animate(100))
        , transition('collapse => expanded', animate(200))
    ])
];

export const arrowToggleAnimation = [
    trigger('animateArrow', [
        state('expanded', style({ transform: 'rotate(180deg)' }))
        , state('collapse', style({ transform: 'rotate(0deg)' }))
        , transition('expanded => collapse', animate(200))
        , transition('collapse => expanded', animate(200))
    ])
];

export const stepperAnimation = [
    trigger('stepperAnimation', [
        state('currentStep', style({ transform: 'translate3d(0,0,0)', visibility: 'visible' }))
        , state('prevStep', style({ transform: 'translate3d(-100%, 0 , 0)', visibility: 'hidden' }))
        , state('nextStep', style({ transform: 'transform(100%, 0 , 0 )', visibility: 'hidden' }))
        , transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ])
]
export const errorMessageAnimation = [
    trigger('errorMessageAnimation', [
        state('enter', style({ transform: 'translateY(0%)', opacity: 1 }))
        , transition('void => enter', [
            style({ opacity: 0, transform: ('translateY(-100%)') })
            , animate("250ms cubic-bezier(0.55, 0, 0.55, 0.2)")
        ])
    ])
]
