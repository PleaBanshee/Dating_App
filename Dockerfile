# .NET SDK version
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
# Working directory
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# copy everything else from project and build
# output the artifacts to the out directory.
COPY . ./
RUN dotnet publish -c Release -o out

# build runtime image
# Changes the base image to the ASP.NET runtime image, 
# which is a smaller image optimized for running .NET applications.
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app

# Copies the published artifacts (output of the build) from the 
# build environment to the current working directory in the runtime image.
COPY --from=build-env /app/out .
# default command to run when the container starts.
# runs the compiled Dating_App.dll using dotnet.
ENTRYPOINT [ "dotnet", "Dating_App.dll" ]