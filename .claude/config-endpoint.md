### Config endpoint

## Gốm 2 tabs là Request và Variables

# Request: 4 Tabs

    - Tab 1: Parameter: Path parameter + Query parameter
    - Tab 2: Header: Tương tự như query parameter
    - Tab 3: Authorization: Hiện tại hỗ trợ duy nhất Bearer token thôi
    - Tab 4: Body: Gồm 4 kiểu: Form-data, raw, x-www-form-urlencoded, binary
        + Form-data: Giống như query parameter, nhưng sẽ cho phép upload cả file (user sẽ chọn giữ kiểu dữ liệu là text và file)

# Variables: Ở đây chúng ta sẽ cho phép user tạo ra các variables và gán nó với giá trị cụ thể. Giá trị này có thể fix cứng, hoặc được lấy từ response data.

Chúng ta sẽ hỗ trợ trích xuất response thông qua cú pháp: $.data.message (ví dụ vậy).

-> Lưu ý tất cả config và biến variables này sẽ lưu trong template, khi thay đổi template đồng nghĩa thay đổi các ý trên.

==> Quan trọng: tôi muốn tạo component input: có hỗ trợ select variable, khi người dùng gõ {{, sẽ hiển thị tất cả variables đã lưu trong template đó, có thể chọn để làm giá trị. Component này sẽ có props để bật tắt được tính năng select variables, nếu tắt đi, nó sẽ là một ô input bình thường.

====
Phase 1: Core Components (Ưu tiên cao)

1. VariableInput Component - Component input hỗ trợ {{ variable selection
2. Template Store Update - Thêm variables vào template data model
3. ConfigPanel Restructure - Tách thành Request/Variables tabs

Phase 2: Request Tab Implementation

4. Base URL Field
5. Parameters Tab - Path variables + Query parameters
6. Headers Tab - Key-value pairs
7. Authorization Tab - Bearer token only
8. Body Tab - 4 types: form-data, raw, x-www-form-urlencoded, binary

Phase 3: Variables Tab

9. Variable Management - CRUD operations
10. Response Extraction - Support $.data.message syntax

Architecture Overview:

- ConfigPanel: 2 main tabs (Request, Variables)
- Request Tab: 4 sub-tabs + Base URL field
- Variables Tab: Variable list + extraction config
- VariableInput: Smart input với {{ autocomplete
- Template Store: Lưu config + variables per template
