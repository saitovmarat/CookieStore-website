import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  currency = "$";
  productsData: any;


  public form: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      product: ["", Validators.required],
      name: ["", Validators.required],
      phone: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.http.get("https://testologia.ru/cookies").subscribe(data => this.productsData = data);
  }
  
  scrollTo(target: HTMLElement, product?: any) {
    target.scrollIntoView({ behavior: "smooth" });
    if (product) {
      this.form.patchValue({
        product:
          product.title + " (" + product.price + " " + this.currency + ")",
      });
    }
  }

  changeCurrency() {
    let newCurrency = "$";
    let coefficient = 1;
    if (this.currency === "$") {
      newCurrency = "₽";
      coefficient = 90;
    } else if (this.currency === "₽") {
      newCurrency = "BYN";
      coefficient = 3;
    } else if (this.currency === "BYN") {
      newCurrency = "€";
      coefficient = 0.9;
    } else if (this.currency === "€") {
      newCurrency = "¥";
      coefficient = 6.9;
    }
    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = Math.round(item.basePrice * coefficient);
    });
  }

  confirmOrder() {
    if (this.form.valid) {
      this.http.post("https://testologia.ru/cookies-order", this.form.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.form.reset();
          },
          error: (response: any) => {
            alert(response.error.message);
          }
        });
    }
  }
}
