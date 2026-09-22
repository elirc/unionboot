// W220: Authorization policy registration / scenario 10
// permission-10 requires authenticated permission drafts.write
// Read prompts/W220.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W220 {

 public static void Configure(IServiceCollection services) {
  services.AddAuthorization(options=>options.AddPolicy("permission-10",p=>p.RequireAuthenticatedUser().RequireClaim("permission","drafts.write")));
 }
}
