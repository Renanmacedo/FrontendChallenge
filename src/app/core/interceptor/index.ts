import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { FakeInterceptor } from './fake-interceptor'

export const httpInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: FakeInterceptor, multi: true}
]