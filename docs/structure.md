"Structure Project :
- constants : chứa hằng số dùng chung
- data : test data tĩnh theo môi trường (stg, dev,...)
- interfaces : định nghĩa TypeScript interfaces/typing cho test data
- locators : tập trung các selector (Locator) dưới dạng class per-page, extends common-locators.ts
- pages : Page Object Model - encapsulate business-level actions/verification, extends common-page.ts
- tests :  chứa spec.ts files (Playwright test) theo thư mục chức năng (Ex : IT/SignIn/signIn.spec.ts....)
- utils : chứa helper chung không thuộc page object: DB access, tab switching, other helpers.


Yêu cầu :
- Project chạy được trên browser Microsoft Edge và Google Chrome
- Khi chạy giao diện sẽ full màn hình
- mode headed và headless được cấu hình trong file .env"



