import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  constructor(private service: CartService, private router: Router, private activated: ActivatedRoute) { }

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  card = {
    nameOnCard: '',
    cardNumber: '',
    expiry: '12/2023',
    cvv: ''
  }
  expirydate: any = new Date();

  placeorder() {
    let month = '';
    let year = '';
    for (let i = 0; i < this.expirydate.length; i++) {
      if (i < 4) {
        year += this.expirydate[i];
      }
      else if (i > 4) {
        month += this.expirydate[i];
      }
    }
    this.card.expiry = month + '/' + year;
    let id = '';
    this.activated.params.pipe(pluck('id')).subscribe(data => id = data);
    this.service.pay(localStorage.getItem('loginuser')!, this.card, id).subscribe(
      res => {
        this.Toast.fire({
          icon: 'success',
          text: res.message
        });
        this.router.navigate(['']);
      },
      err => {
        this.Toast.fire({
          icon: 'error',
          text: err.error.message
        })
      }
    );
  }
}
