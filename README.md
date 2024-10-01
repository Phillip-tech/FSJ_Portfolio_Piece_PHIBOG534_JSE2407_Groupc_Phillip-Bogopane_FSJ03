# PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02


# 🛍️ NextEcommerce - Modern E-commerce Platform

Welcome to **NextEcommerce**, an advanced e-commerce platform built with **Next.js 14**. This platform offers a rich, interactive shopping experience with advanced search, filtering, and sorting capabilities.
---

## 📚 Table of Contents
- [🔍 Overview](#-overview)
- [✨ Features (User Stories)](#-features-user-stories)
- [🛠️ Technologies Used](#-technologies-used)
- [🎨 Styling & Design](#-styling--design)
- [🚀 Installation & Setup](#-installation--setup)
- [🌐 Usage](#-usage)
- [⚙️ Challenges Faced](#-challenges-faced)
- [📱 Responsive Design](#-responsive-design)
- [💡 Reflections](#-reflections)
- [🖼️ Product Previews](#-product-previews)
- [💻 Folder Structure](#-folder-structure)

---

## 🔍 Overview
This project showcases advanced features including dynamic search, filtering, sorting, pagination, and SEO optimization, all while leveraging server-side rendering for optimal performance.

---

## ✨ Features (User Stories)
### **User Interaction**
- Search for products by title **(Medium)**
- Filter products by categories **(Medium)**
- Sort products by price (ascending/descending) **(Medium)**
- URL reflects current search, filter, and sort options **(Medium)**
- Paginate filtered and sorted results exceeding 20 products **(Hard)**
- Retain filtering, sorting, and searching after navigating to product detail **(Hard)**
- Reset all filters, sorting, and search at once **(Medium)**
- Sort reviews by date and rating in product detail page **(Medium)**

---
### **Developer Features**

- Query API with combined search, filter, sort, and pagination **(Hard)**
- Parse URL on page load to apply search, filter, and sort parameters **(Hard)**
- Improve SEO with meta tags **(Easy)**
- Generate dynamic metadata for products **(Hard)**
- Optimize images using Next.js features **(Easy)**
- Implement caching strategies for data fetching **(Medium)**
---

### **UI/UX**
- Responsive and visually appealing design

## 🛠️ Technologies Used
- **Next.js 14** - App Router, Server Components
- **React** - Dynamic rendering, state management
- **Tailwind CSS** - Utility-first responsive design
- **Node.js** - Deployment and API hosting
- **JavaScript** - Core programming language

---

## 🎨 Styling & Design
I  used **Tailwind CSS** for a responsive, utility-first design approach. The UI adapts seamlessly across devices, ensuring a consistent and intuitive user experience.

## 🚀 Installation & Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Phillip-tech/PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd next-ecommerce
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Run the development server:**
    ```bash
    npm run dev
    ```

5. **Build the project:**
    ```bash
    npm run build
    ```

## 🌐 Usage
- **Product Listing Page:** Displays products with search, filter, and sort options.
- **Detailed Product View:** Shows comprehensive product information and sortable reviews.
- **URL Sharing:** Share specific product views using URL parameters.

## ⚙️ Challenges Faced
- Implementing complex API queries for combined search, filter, and sort functionality.
- Maintaining state across navigation while updating the URL.
- Optimizing performance with server-side rendering and caching strategies.

## 📱 Responsive Design
The platform is designed to provide an optimal viewing experience across a wide range of devices, from mobile phones to desktop computers.

## 💡 Reflections
This project pushed the boundaries of what's possible with **Next.js 14**, particularly in areas of:
- Advanced state management across server and client components
- SEO optimization techniques
- Performance tuning for complex, dynamic e-commerce applications

## 🖼️ Website Previews

### Here's an example of the SearchBar Snapshot: 

![image alt](https://github.com/Phillip-tech/PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02/raw/e6914e1840bd166c2590485da1476bd5b172fce5/SearchBar.png)

### Here's an example of the All Categories(Price: Low to High ) Snapshot: 

![image alt](https://github.com/Phillip-tech/PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02/raw/e6914e1840bd166c2590485da1476bd5b172fce5/AllCategoriesPriceLowtoHigh.png)

 
### Here's an example of the All Categories(Price:High to Low ) Snapshot: 

![image alt](https://github.com/Phillip-tech/PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02/raw/e6914e1840bd166c2590485da1476bd5b172fce5/AllCategoriesPriceHightoLow.png)

### Here's an example of the SortByDropdown:All Categories(selected category)-Price:Low to High Snapshot: 
![image alt](https://github.com/Phillip-tech/PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02/raw/e6914e1840bd166c2590485da1476bd5b172fce5/SelectedCategoryPriceLowtoHigh.png)

### Here's an example of the SortByDropdown:All Categories(selected category)-Price:High to Low Snapshot: 
![image alt](https://github.com/Phillip-tech/PHIBOG534_JSE2407_Groupc_Phillip-Bogopane_FSJ02/raw/e6914e1840bd166c2590485da1476bd5b172fce5/SelectedCategoryPriceHightoLow.png)
---
## 💻 Folder Structure
```
next-ecommerce/
├── 📁 app/
│   ├── 📁 components/
│   │   ├── 📝 CategoryFilter.jsx
│   │   ├── 📝 ErrorMessage.js
│   │   ├── 📝 Footer.js
│   │   ├── 📝 GoBackButton.jsx
│   │   ├── 📝 Header.js
│   │   ├── 📝 Loading.js
│   │   ├── 📝 Pagination.js
│   │   ├── 📝 ProductCard.js
│   │   ├── 📝 ProductGallery.jsx
│   │   ├── 📝 ResetButton.jsx
│   │   ├── 📝 SearchBar.jsx
│   │   └── 📝 SortDropdown.jsx
│   ├── 📝 globals.css
│   ├── 📝 layout.js
│   ├── 📝 page.js
│   └── 📁 products/
│       ├── 📝 [id]/page.js
│       └── 📝 page.js
├── 📝 package.json
├── 📝 next.config.js
└── 📝 README.md
```


