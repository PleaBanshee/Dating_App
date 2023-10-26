namespace Dating_App.Extensions
{
    public static class DateTimeExtensions
    { 
        // extension method for the DateOnly struct
        public static int CalculateAge(this DateOnly dob)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var age = today.Year - dob.Year;
            // if the user hasn't had their birthday yet this year, subtract 1 from their age
            if (dob > today.AddYears(-age))
                age--;
            return age;
        }
    }
}
