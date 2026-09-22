// W471: Sparse fieldset projection / Default fields id
namespace DotnetWeb;
public static class W471{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W471");}
}
