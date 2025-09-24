Đây là sản phẩm Chain API. Một giải pháp phần mềm, cho phép người dùng có thể kiểm tra api một cách phức tạp hơn, trực quan hơn. Thay vì kiểm tra từng endpoint, bây giờ chúng ta có thể kiểm tra 1 loạt các api, với các điều kiện phức tạp phụ thuộc vào nhau.

# Đây là tài liệu tôi suy tầm được:

I: Bạn muốn giải quyết vấn đề gì? 1. Bắt đầu bằng nỗi đau, không phải giải pháp - Quan sát: Dường như dev và tester không để ý đến việc test 1 luồng api hoàn chỉnh, chỉ đơn giản tập trung test cho từng endpoint đơn lẻ - Vấn đề thực sự có thể là: Việc kiểm tra một luồng API phức tạp bằng cách kiểm tra từng endpoint một cách thủ công hoặc với các công cụ đơn giản là tốn thời gian và thiếu tính trực quan. Điều này dẫn đến quy trình phát triển và kiểm thử bị chậm lại, đồng thời làm tăng nguy cơ phát hiện lỗi muộn. - Vấn đề dựa trên giải pháp: Muốn xây dựng một công cụ kiểm thử API flow, sau đó giả định rằng vấn đề là các nhà phát triển thiếu công cụ để dễ dàng test api flow và trực quan hóa chúng

    2. Tìm nguyên nhân gốc rễ, không phải triệu chứng
    - Triệu chứng: Dev và tester mất quá nhiều thời gian để kiểm thử API và thường xuyên bỏ sót các lỗi trong các luồng nghiệp vụ phức tạp.
    - Nguyên nhân gốc rễ: Vấn đề không hẳn là do họ thiếu kỹ năng hay do API quá phức tạp, mà có thể là do các công cụ hiện có không đủ mạnh mẽ và linh hoạt để mô phỏng các kịch bản thực tế một cách hiệu quả. Điều này khiến họ phải kiểm tra một cách thủ công, thuần tự từng endpoint, dẫn đến hiệu suất thấp và dễ bỏ sót lỗi.
    - Giải pháp của bạn giải quyết trực tiếp nguyên nhân gốc rễ này bằng cách cung cấp một công cụ mạnh mẽ, trực quan, cho phép mô phỏng các luồng API phức tạp một cách dễ dàng và hiệu quả hơn.

II: Động não 1. Bắt đầu với một vấn đề bạn đã gặp phải
Nhìn lại cuộc sống và công việc hàng ngày của bạn, điều gì luôn khiến bạn cảm thấy "đau đớn"? Bạn mong muốn điều gì tồn tại?
Trong quá trình phát triển phần mềm, việc kiểm thử API là một công việc lặp đi lặp lại và thường gây nản lòng, đặc biệt khi phải xử lý các luồng dữ liệu phức tạp. Một công cụ giúp trực quan hóa toàn bộ quy trình kiểm thử thay vì phải nhảy qua lại giữa các cửa sổ, kiểm tra từng API một cách riêng lẻ và tự ghép nối các dữ liệu lại với nhau. Việc này tốn rất nhiều thời gian và làm giảm sự tập trung vào các vấn đề cốt lõi. Tôi muốn một giải pháp cho phép tôi xây dựng kịch bản kiểm thử một cách dễ dàng, trực quan, và có thể tái sử dụng.

    2. Tìm kiếm những thay đổi gần đây trên thế giới
    Những thay đổi đó thường tạo ra những vấn đề mới.
    Làm thế nào để kiểm thử một cách đáng tin cậy khi một kịch bản người dùng liên quan đến nhiều API khác nhau, thậm chí từ các dịch vụ khác nhau? Các công cụ kiểm thử truyền thống chỉ tập trung vào việc kiểm tra từng endpoint, không đủ khả năng để xử lý sự phức tạp và sự phụ thuộc lẫn nhau của các luồng API trong môi trường hiện đại.

    3. Tìm kiếm một không gian vấn đề chưa bị công nghệ làm gián đoạn một cách có hệ thống
    Hãy cẩn thận với "ý tưởng cái hố bẫy" (tarpit idea)!
    Kiểm thử API đã tồn tại từ lâu và có rất nhiều công cụ trên thị trường (Postman, Insomnia, Paw, ...). Tuy nhiên, hầu hết các công cụ này đều tập trung vào việc kiểm thử từng API riêng lẻ, hoặc yêu cầu người dùng phải tự viết code để tạo các kịch bản phức tạp. Không gian này chưa có một giải pháp công nghệ nào thực sự tích hợp quy trình kiểm thử phức tạp một cách trực quan và đơn giản. Vấn đề này có vẻ "dễ" vì đã có nhiều công cụ, nhưng nó lại là một "cái hố bẫy" vì giải quyết triệt để sự phức tạp và sự phụ thuộc giữa các API là một thách thức lớn về mặt cấu trúc. Bạn cần một giải pháp thực sự khác biệt để vượt qua các công cụ hiện có.

Tài liệu mà tôi tổng hợp, nghiên cứu được ở đường link này:
https://docs.google.com/document/d/1tfmMBJ9jbFfvC6mlkrRt18Gi0U0mfSHSv77WtPbTGnw/edit?tab=t.0
https://docs.google.com/document/d/1V-By7_tuIjuWvJCfoVZev6oFWkjvsRzK5dBw8YlpbOU/edit?tab=t.0

====

Từ những tài liệu tôi cung cấp, tôi cần bạn nghiên cứu thêm thật chi tiết cho ý tưởng sản phẩm này. Sau đó làm cho tôi trang home-page, trang home-page này tương ứng với page đầu tiên trong app folder, không cần tạo thêm route nữa.

- Sử dụng taiwindcss + shadcn-ui
- Không cần dark mode / light mode, không multi languages
- Thiết kế với giao diện đơn giản, hiện tại, bộc lộ được những thế mạnh mà dự mang đến
- Phù hợp hiện thị cho mọi thiết bị: pc, laptop, tablet, mobile
- Xây dựng structure folder một cách thông minh: dễ dàng sử dụng và tái sử dụng, chủ động phân chia component một cách thông minh

--> Xây dựng content home-page với nội dung hoàn toàn bằng tiếng anh nhé.
