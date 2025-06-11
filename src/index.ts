import './scss/styles.scss'; 
import { API_URL, CDN_URL } from './utils/constants'; 
import { ensureElement } from './utils/utils'; 
import { FormErrorsType, IOrderData, IProduct } from './types'; 
import { EventEmitter } from './components/base/events'; 
import { ApiClient } from './components/base/ApiClient'; 
import { AppData } from './components/model/AppData'; 
import { BasketModel } from './components/model/BasketModel'; 
import { OrderForm } from './components/model/OrderForm'; 
import { Basket } from './components/view/Basket'; 
import { BasketItem } from './components/view/BasketItem'; 
import { Card } from './components/view/Card'; 
import { ContactsForm } from './components/view/ContactsForm'; 
import { Modal } from './components/view/Modal'; 
import { Order } from './components/view/Order'; 
import { Page } from './components/view/Page';
import { Success } from './components/view/Success'; 
import { CardPreview } from './components/view/CardPreview'; 

const events = new EventEmitter(); 
const pageContainer = ensureElement<HTMLElement>('.page'); 
const cardContainer = ensureElement<HTMLElement>('.gallery'); 
const templateCardCatalog = document.querySelector( 
    '#card-catalog' 
) as HTMLTemplateElement; 
const templateCarPreview = document.querySelector( 
    '#card-preview' 
) as HTMLTemplateElement; 
const templateBasket = document.querySelector('#basket') as HTMLTemplateElement; 
const templateCardBasket = document.querySelector('#card-basket') as HTMLTemplateElement; 
const templateOrder = document.querySelector('#order') as HTMLTemplateElement; 
const templateContacts = document.querySelector( 
    '#contacts' 
) as HTMLTemplateElement; 
const templateSuccess = document.querySelector( 
    '#success' 
) as HTMLTemplateElement; 
const apiClient = new ApiClient(CDN_URL, API_URL); 
const appData = new AppData(events); 
const basketModel = new BasketModel(events); 
const orderForm = new OrderForm(events); 
const page = new Page(events, pageContainer); 
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); 
const cardPreview = new CardPreview(templateCarPreview, events); 
const viewBasket = new Basket(templateBasket, events); 
const viewContacts = new ContactsForm(templateContacts, events); 
const viewSuccess = new Success(templateSuccess, events); 
const viewOrder = new Order(templateOrder, events); 

apiClient.getProductList()
    .then((product: IProduct[]) => { 
        appData.productCards = product; 
        product.forEach((item: IProduct) => { 
            const card = new Card(templateCardCatalog, () => { 
                events.emit('card:select', item); 
            }); 
            cardContainer.append(card.render(item)); 
        }); 
    })
    .catch((error: Error) => {
        console.error('Ошибка при загрузке списка товаров:', error);
    });

events.on('card:select', (item: IProduct) => { 
    appData.setPreview(item); 
    const preview = cardPreview.render(item); 
    modal.setContent(preview); 
    modal.open(); 
}); 

events.on('basket:open', () => { 
    const basketItems = basketModel.basketProducts; 
    if (basketItems.length > 0) { 
        const basketItemsHtml = basketItems.map((item, index) => { 
            const basketItemView = new BasketItem(templateCardBasket, () => { 
                basketModel.removeFromBasket(item); 
                events.emit('basket:open'); 
            }); 
            return basketItemView.render(item, index + 1); 
        }); 

        viewBasket.items = basketItemsHtml; 
        viewBasket.renderTotalSumProduct(basketModel.getTotalSumProduct()); 
    } else { 
        viewBasket.items = []; 
        viewBasket.renderTotalSumProduct(0); 
    } 
    modal.setContent(viewBasket.render()); 
    modal.open(); 
}); 

events.on('card:addBasket', () => { 
    const selectedCard = appData.selectedCard; 
    if (selectedCard) { 
        basketModel.addToBasket(selectedCard); 
        modal.close(); 
    } 
}); 

events.on( 
    'basket:check', 
    ({ id, callback }: { id: string; callback: (result: boolean) => void }) => { 
        const isInBasket = basketModel.isInBasket(id); 
        callback(isInBasket); 
    } 
); 

events.on('basket:remove', (product: IProduct) => { 
    basketModel.removeFromBasket(product); 
}); 

events.on('order:open', () => { 
    modal.setContent(viewOrder.render()); 
    modal.open() 
    orderForm.validOrder() 
}) 

events.on('contacts:open', () => { 
    modal.setContent(viewContacts.render()) 
    modal.open() 
    orderForm.validContact() 
}) 

events.on('contacts:submit', async () => { 
    const formState = orderForm.getFormState(); 
    const orderData: IOrderData = { 
        address: formState.data.address, 
        email: formState.data.email, 
        phone: formState.data.phone, 
        payment: formState.data.payment, 
        total: basketModel.getTotalSumProduct(), 
        items: basketModel.basket.map((item) => item.id) 
    } 
    try { 
        const res = await apiClient.postOrder(orderData); 
        modal.setContent(viewSuccess.render(res.total)); 
        modal.open(); 
        basketModel.clearBasket(); 
    } catch (error) { 
        console.error('Ошибка при оформлении заказа:', error); 
        modal.setContent(viewOrder.render()); 
        modal.open(); 
    } 
}) 

events.on('order:setAddress', ({ address }: { address: string }) => { 
    orderForm.setAddressForm(address) 
}) 

events.on('contacts:setEmail', ({ email }: { email: string }) => { 
    orderForm.setOrderForm('email', email) 
}) 

events.on('contacts:setPhone', ({ phone }: { phone: string }) => { 
    orderForm.setOrderForm('phone', phone); 
}) 

events.on('order:setPaymentMethod', ({ paymentMethod }: { paymentMethod: string }) => { 
    orderForm.setPaymentMethod(paymentMethod) 
}) 

events.on('order:stateChange', ({ isValid }: { isValid: boolean }) => { 
    viewOrder.isValid = isValid 
}) 

events.on('contacts:stateChange', ({ isValid }: { isValid: boolean }) => { 
    viewContacts.isValid = isValid; 
}) 

events.on('order:validationErrors', (err: FormErrorsType) => { 
    viewOrder.displayErrors(err) 
}) 

events.on('contacts:validationErrors', (err: FormErrorsType) => { 
    viewContacts.displayErrors(err) 
}) 

events.on('success:close', () => { 
    modal.close() 
}) 

events.on('modal:open', () => { 
    page.locked = true; 
}) 

events.on('modal:close', () => { 
    page.locked = false; 
})