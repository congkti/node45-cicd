# Dockerfile dùng để build image (image là một source code tĩnh)
# #####################################################
# 1. Cài node_module cho máy Docker (mỗi máy đc build node_module khác nhau cho cùng 1 source app, nên cần phải cài lại node_module khi qua mỗi máy, khác nhau): phiên bản node,...

# alpine: chỉ định phiên bản node mới nhất và đc thu gọn (~5MB), chỉ lấy và nén cái cần thiết. Nếu ko có alpine thì mặc định sẽ lấy phiên bản Node đc cài trên máy tính
FROM node:20.9.0-alpine

# thiết lập đường dẫn root (tùy chỉnh): là nơi chứa source code app trên server
WORKDIR /home/app

# copy source code: vào thư mục nào (dấu . đại diện cho thư mục root (/app) trong thư mục trên docker | dấu * đại diện cho các từ khóa bất kỳ nằm ở vị trí đó)
COPY package*.json .

################### Xử lý Lỗi OpenSSL
# Hầu hết các Docker images cơ bản như node, alpine, hoặc ubuntu không cài đặt sẵn phiên bản OpenSSL cần thiết. Bạn cần thêm OpenSSL vào Docker image.
# Nếu chạy bị lỗi OpenSSL thì chạy lệnh này để cập nhật gói OpenSSL, vì Prisma yêu cầu OpenSSL 1.1.x
# Đối với alpine -> chạy lệnh này
RUN apk add --no-cache openssl1.1-compat
# Đối với ubuntu -> chạy lệnh này
# RUN apt-get update && apt-get install -y openssl libssl-dev
#########################

# Chạy câu lệnh để cài node_module: khi cài src lớn sẽ tốn tg nên mình cần set tg chờ để cài --timeout=... (milisecond)
# 5m => 5*60s*1000 = 300.000 ms
RUN npm install --timeout=300000 --force

# Copy hết (dùng lệnh COPY . .) các file còn lại (kể cả copy lại package.json ở trên => tuy nhiên sẽ thực hiện cơ chế cache, giải thích bên dưới)
COPY . .
# Sẽ có nhưng file/folder ko cần copy vì không sử dụng (.gitignore, .vscode, coverage,... ) => tạo ra file .dockerignore để loại trừ

# Generate cấu trúc cho prisma
RUN npx prisma generate

# Kết thúc build -> start server: Khi chay câu lệnh RUN -> chương trình sẽ chạy câu lệnh liên tục ko dừng. Do đó để kết thúc phải dùng câu lệnh CMD... để chạy lệnh sau cùng và kết thúc build. Sau lệnh này sẽ ko chạy bất cứ lệnh nào nữa
CMD [ "npm","run","start" ]

# ###################### END #########################

# Giải thích cơ chế cache:
# Khi chạy qua mỗi câu lệnh, cache sẽ lưu lại lệnh đó trong một vùng nhớ của mình, chỉ khi nào có sự thay đổi nó mới chạy lại và lưu mới
# Đầu tiên cache sẽ quét qua lệnh copy package.json, nếu file này có thay đổi thì mới chạy lệnh <npm install> bên dưới để cài lại thay đổi node package, ko thay đổi sẽ ko cần chạy. 
# Lệnh COPY . . phải đặt sau lệnh COPY package.json để đảm bảo việc copy tất cả này mà ko có thay đổi package.json thì chương trình sẽ láy cache node_package để dùng chứ ko cần phải chạy cài đặt node package (vốn rất mất nhiều thời gian để cài)
# Code thay đổi mà package.json ko thay đổi thì chỉ cần COPY file code chứ ko cần cài đặt thư viện

