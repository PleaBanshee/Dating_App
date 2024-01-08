using AutoMapper;
using Dating_App.Controllers;
using Dating_App.Data;
using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Moq;

namespace Dating_App_Tests
{
    public class AccountControllerTests
    {
        [Fact]
        public async Task Register_ValidModel_ReturnsUserDto()
        {
            var userManagerMock = MockUserManager<AppUser>();
            var mapperMock = new Mock<IMapper>();
            var tokenServiceMock = new Mock<ITokenService>();

            var controller = new AccountController(userManagerMock.Object, mapperMock.Object, tokenServiceMock.Object);
            var registerDto = new RegisterDto { Username = "testuser", Password = "testpassword" };

            userManagerMock.Setup(x => x.FindByNameAsync(It.IsAny<string>()))
               .Returns(Task.FromResult<AppUser?>(null));

            userManagerMock.Setup(x => x.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                           .ReturnsAsync(IdentityResult.Success);

            var result = controller.Register(registerDto).Result;

            Assert.IsType<UserDto>(result.Value);
        }

        [Fact]
        public async Task Login_ValidModel_ReturnsUserDto()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase("test-database")
                .Options;

            using var context = new DataContext(options);

            var user = new AppUser
            {
                UserName = "testuser",
                DateOfBirth = new DateOnly(1998, 7, 22),
                FullName = "Test User",
                Created = DateTime.UtcNow,
                Gender = "Male",
                Introduction = "Test Introduction",
                LookingFor = "Test Looking For",
                Interests = "Test Interests",
                City = "Test City",
                Country = "Test Country"
            };

            context.Users.Add(user);
            context.SaveChanges();

            var userManagerMock = MockUserManager<AppUser>();
            userManagerMock.Setup(x => x.FindByNameAsync("testuser"))
                           .ReturnsAsync(user);

            userManagerMock.Setup(x => x.CheckPasswordAsync(user, "testpassword"))
                           .ReturnsAsync(true);

            var mapperMock = new Mock<IMapper>();
            var tokenServiceMock = new Mock<ITokenService>();

            var controller = new AccountController(userManagerMock.Object, mapperMock.Object, tokenServiceMock.Object);
            var loginDto = new LoginDto { Username = "testuser", Password = "testpassword" };

            var result = controller.Login(loginDto).Result;

            Assert.IsType<UserDto>(result.Value);
        }

#nullable enable
        public class MockDbSet<T> : DbSet<T> where T : class
        {
            private readonly List<T> _data;

            public MockDbSet(IEnumerable<T>? data = null)
            {
                _data = data?.ToList() ?? new List<T>();
            }

            public override IQueryable<T> AsQueryable() => _data.AsQueryable();

            public override IAsyncEnumerable<T> AsAsyncEnumerable() => _data.AsEnumerable().ToAsyncEnumerable();

            public override IEntityType EntityType => throw new NotImplementedException();

            public override ValueTask<T?> FindAsync(params object?[]? keyValues) =>
                new ValueTask<T?>(_data.Find(ConvertKeyValues(keyValues)));

            public override ValueTask<T?> FindAsync(object?[]? keyValues, CancellationToken cancellationToken) =>
                new ValueTask<T?>(_data.Find(ConvertKeyValues(keyValues)));

            private Predicate<T> ConvertKeyValues(object?[]? keyValues)
            {
                return item =>
                {
                    var properties = typeof(T).GetProperties();

                    if (keyValues == null || keyValues.Length != properties.Length)
                        return false;

                    for (int i = 0; i < keyValues.Length; i++)
                    {
                        if (keyValues[i] == null || !object.Equals(properties[i].GetValue(item), keyValues[i]))
                            return false;
                    }

                    return true;
                };
            }

        }

        private Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : IdentityUser<int>, new()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase("test-database")
                .Options;

            var dbContext = new DataContext(dbContextOptions);

            var userStore = new UserStore<TUser, IdentityRole<int>, DataContext, int, IdentityUserClaim<int>,
                IdentityUserRole<int>, IdentityUserLogin<int>, IdentityUserToken<int>,
                IdentityRoleClaim<int>>(dbContext);

            var userManagerMock = new Mock<UserManager<TUser>>(
                userStore,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );

            // Configure UserManager to support async operations
            userManagerMock.Setup(x => x.CheckPasswordAsync(It.IsAny<TUser>(), It.IsAny<string>()))
                           .ReturnsAsync(true);

            userManagerMock.Setup(x => x.CreateAsync(It.IsAny<TUser>(), It.IsAny<string>()))
                           .ReturnsAsync(IdentityResult.Success);

            userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<TUser>(), It.IsAny<string>()))
                           .ReturnsAsync(IdentityResult.Success);

            userManagerMock.Setup(x => x.FindByNameAsync(It.IsAny<string>()))
               .ReturnsAsync((string userName) => userManagerMock.Object.Users.FirstOrDefault(u => u.UserName == userName));

            userManagerMock.Setup(x => x.CheckPasswordAsync(It.IsAny<TUser>(), It.IsAny<string>()))
                           .ReturnsAsync(true);

            userManagerMock.Setup(x => x.Users)
                           .Returns(new MockDbSet<TUser>());

            return userManagerMock; // Return the mock directly, not userManagerMock.Object
        }
    }
}