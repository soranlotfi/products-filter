const filterInput = document.querySelector(".filter-input")
const filterButtons = document.querySelectorAll(".header-filter-btn")
const productsContainer = document.querySelector(".products-container")
let searchType = "all";
let searchWord = "none";
//1.get the elements from the dom
// 2.get the elemnts from the back end and render them
const Api = axios.create({
    baseURL: "http://localhost:3000"
})
document.addEventListener("DOMContentLoaded", async () => {
    const products = new Products()
    const ui = new Ui()
    const productsList = await products.getProducts()
    ui.renderProducts(productsList)
    ui.getFilterButtons()
})
filterInput.addEventListener("input", (e) => {
    Search.filterProducts({search: e.target.value})
})
class Products {
    async getProducts() {
        const products = await Api.get('/items')
        return products.data
    }
}
class Ui {
    async renderProducts(products) {
        const result = await products.map((product) => {
            return ` <div class="product">
                            <div class="product-image">
                                <img draggable="false" src='${product.image}' alt="">
                            </div>
                            <div class="product-details">
                                <p class="product-text">${product.title}</p>
                                <p class="product-price">${product.price}</p>
                            </div>
                        </div>  `
        })

        let Error = `<div class="product">
                            <div class="product-image" style="display: flex; justify-content: center ; align-items: center">
                               <h1>
                               متاسفانه محصولی یافت نشد :/
</h1>
                            </div>
                        </div>`
       result.length>0 ? productsContainer.innerHTML = result : productsContainer.innerHTML = Error
    }

    changeButtonsColor(buttons, number=0,click=false) {
        buttons.forEach(btn => {
            if (btn.dataset.focus === "true" && click) btn.dataset.focus = "false"
            if (btn.dataset.number === number) btn.dataset.focus = "true"
            if (btn.dataset.focus === "true") {
                btn.classList.add("focus")
            }else{
                btn.classList.remove("focus")
            }
        })
    }

    getFilterButtons() {
        const buttons = [...filterButtons]
        this.changeButtonsColor(buttons)
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                searchType = e.target.dataset.type
                this.changeButtonsColor(buttons, e.target.dataset.number,true)
                Search.filterProducts({type: e.target.dataset.type, search: filterInput.value})
            })
        })
    }
}
class Search {
    static async filterProducts({type = searchType, search = searchWord}) {
        const products = new Products()
        const ui = new Ui()
        const productsList = await products.getProducts()
        let filteredProducts
        filteredProducts = this.filterProductsByType(productsList, type)
        filteredProducts = this.filterProductsBySearch(filteredProducts, search)
        ui.renderProducts(filteredProducts)
    }

    static filterProductsByType(productsList, type) {
        if (type !== "all") {
            return productsList.filter(product => product.class === type)
        }
        return productsList
    }

    static filterProductsBySearch(productsList, searchWord) {
        if (searchWord !== "none") {
            return productsList.filter(product => product.title.toLowerCase().trim().includes(searchWord.toLowerCase().trim()))
        }
        return productsList
    }
}
